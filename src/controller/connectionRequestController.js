const ConnectRequestModel = require('../model/connectionRequest');
const { User } = require('../model/user');

class connectionRequest {
    // sending the connnection request
    async sendingConnectionRequest(req, res) {
        try {
            let fromUserId = req.user._id;
            let toUserId = req.params.userId;
            let status = req.params.status;
            // Checking whether toUserId exit or not.
            let toUserExit = await User.findById(toUserId);
            console.log('toUserExit', toUserExit);
            if (!toUserExit) {
                return res.status(400).json({
                    message: "User is not found"
                });
            };
            // Added the validation for the API can be used only for two status
            if (!['ignored', 'interested'].includes(status)) {
                return res.status(404).json({ message: "Invalid status type:" + requestStatus });
            };
            // Checking whether the different user make connectionReqest for the same user.
            const existingConnectionRequest = await ConnectRequestModel.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });
            if (existingConnectionRequest) {

                return res.status(400).json({ message: 'Connection requst already exist' });
            };
            const connectionReqeuestObj = new ConnectRequestModel({
                fromUserId,
                toUserId,
                status
            });

            const data = await connectionReqeuestObj.save();
            res.status(200).json({
                message: 'Connection request has been sent',
                data: data
            });

            console.log('connectionRequestObj', connectionReqeuestObj);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }
    // reviewing the request
    async reviewingConnectionRequest(req, res) {
        try {
            let requestId = req.params.requestId;
            let status = req.params.status;
            let allowedStatusToPass = ['accepted', 'rejected'];
            // Only allowed status to be updated
            if (!allowedStatusToPass.includes(status)) {
                return res.status(400).json({ message: 'status is not valid' });
            };
            const userLoggedIn = req.user;

            let connectionRequestFound = await ConnectRequestModel.findOne({
                _id: requestId,
                status: 'interested',
                toUserId: userLoggedIn._id
            });

            // Check whetehr connectionRequested exist and toUserId exist 
            if (!connectionRequestFound) {
                return res.status(400).json({
                    message: 'Connection request does not found'
                });
            };

            connectionRequestFound.status = status;
            console.log('connectionData', connectionRequestFound);
            const data = await connectionRequestFound.save();


            res.status(201).json({
                message: (status === 'accepted' ? `${userLoggedIn.firstName + ' ' + userLoggedIn.lastName} accepted the connection request` : `${userLoggedIn.firstName + '' + userLoggedIn.lastName} rejected the connection request`),
                data: data

            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
};
module.exports = connectionRequest;