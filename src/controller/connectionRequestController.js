const ConnectRequestModel = require('../model/connectionRequest');


class connectionRequest {

    async sendingConnectionRequest(req, res) {
        try {
            let requestedById = req.user._id;
            let requestedToWhome = req.params.userId;
            let requestStatus = req.params.status
            console.log('000', requestedById, '1111', requestedToWhome, '3333', requestStatus);
            const connectionReqeuestObj = new ConnectRequestModel({
                fromUserId: requestedById,
                toUserId: requestedToWhome,
                status: requestStatus
            })
            const data = await connectionReqeuestObj.save();
            res.status(200).json({
                message:'Connection request has been sent',
                data:data
            });

            console.log('connectionRequestObj', connectionReqeuestObj);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }
};
module.exports = connectionRequest;