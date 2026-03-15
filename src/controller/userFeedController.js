const ConnectRequestModel = require('../model/connectionRequest');
const { User } = require('../model/user');

const UserAllowedData = ["firstName", "lastName", "gender", "age", "skills", "profilePic"];
const userFeedController = {
    userFeeds: async (req, res) => {
        try {
            const usersData = await User.find({});
            if (!usersData) throw new Error('Users data not appear');
            res.status(200).send(usersData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get all the pending request for the loggedin request.
    userPendingRequest: async (req, res) => {
        try {
            let loggedInUser = req.user;
            let loggedInUserPendingRequest = await ConnectRequestModel.find({
                toUserId: loggedInUser._id,
                status: 'interested'
            }).populate("fromUserId", UserAllowedData);

            if (loggedInUserPendingRequest.length <= 0) {
                return res.status(200).json({
                    message: 'No pending connection request',
                    data: loggedInUserPendingRequest
                })
            };

            res.status(200).json({
                message: 'following are the pending requests',
                data: loggedInUserPendingRequest
            })
        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    },
    userConnections: async (req, res) => {
        try {
            let loggedInUser = req.user;
            let myConnections = await ConnectRequestModel.find({
                $or: [
                    {
                        fromUserId: loggedInUser._id, status: 'accepted'
                    },
                    {
                        toUserId: loggedInUser._id, status: 'accepted'
                    }
                ]
            }).populate('fromUserId', UserAllowedData).
                populate('toUserId', UserAllowedData);
            //    send only the connected user data
            const data = myConnections.map((item) => {
                if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return item.toUserId;
                }
                return item.fromUserId;
            })
            res.status(200).json({
                message: 'Logged in connections',
                data: data
            })

        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    }

}

module.exports = userFeedController