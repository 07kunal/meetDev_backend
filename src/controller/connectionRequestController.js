const ConnectionRequestModel = require('../model/connectionRequest');
const { User } = require('../model/user');

class connectionRequest {
    // sending the connnection request
    async sendingConnectionRequest(req, res) {
        try {
            let userLoggedIn = req.user;
            let fromUserId = req.user._id;
            let toUserId = req.params.userId;
            let status = req.params.status;
            // Checking whether toUserId exit or not.
            let toUserExit = await User.findById(toUserId);
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
            const existingConnectionRequest = await ConnectionRequestModel.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            });
            if (existingConnectionRequest) {

                return res.status(400).json({ message: 'Connection requst already exist' });
            };
            const connectionReqeuestObj = new ConnectionRequestModel({
                fromUserId,
                toUserId,
                status
            });

            const data = await connectionReqeuestObj.save();
            res.status(200).json({
                message: (status === 'interested' ? `${userLoggedIn.firstName + ' ' + userLoggedIn.lastName} send the connection request` : `${userLoggedIn.firstName + '' + userLoggedIn.lastName} ignore the connection`),
                data: data?.status
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }
    // reviewing the request
    async reviewingConnectionRequest(req, res) {
        try {
            let requestId = req.params.requestId;  // connection request
            let status = req.params.status;
            let allowedStatusToPass = ['accepted', 'rejected'];
            // Only allowed status to be updated
            if (!allowedStatusToPass.includes(status)) {
                return res.status(400).json({ message: 'status is not valid' });
            };
            const userLoggedIn = req.user;

            let connectionRequestFound = await ConnectionRequestModel.findOne({
                _id: requestId,
                // $in is cleaner when you’re just checking if a field matches one of several values.
                status: { $in: ["interested", "accepted"] },
                toUserId: userLoggedIn._id
            });

            // Check whetehr connectionRequested exist and toUserId exist 
            if (!connectionRequestFound) {
                return res.status(400).json({
                    message: 'Connection request does not found'
                });
            };

            connectionRequestFound.status = status;
            const data = await connectionRequestFound.save();


            res.status(201).json({
                message: (status === 'accepted' ? `${userLoggedIn.firstName + ' ' + userLoggedIn.lastName} accepted the connection request` : `${userLoggedIn.firstName + '' + userLoggedIn.lastName} rejected the connection request`),
                data: data?.status

            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
    async deleteConnectionRequest(req, res) {
        try {
            let requestId = req.params.requestId;
            // findOneAndDelete help to remove one item as per the given query
            const deletedConnection = await ConnectionRequestModel.findOneAndDelete({
                _id: requestId,
                status: { $in: ["interested", "rejected"] },
            });
            if (deletedConnection) {

                res.send("Selected Connection Request has been delete");
            } else {
                res.status(400).send("Error occured");

            }

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

};
module.exports = connectionRequest;