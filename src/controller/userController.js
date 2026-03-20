const ConnectRequestModel = require('../model/connectionRequest');
const { User } = require('../model/user');

const UserAllowedData = ["firstName", "lastName", "gender", "age", "skills", "profilePic"];
const userController = {
    userFeeds: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            console.log('limit',limit);
            limit = limit < 50 ? limit : 10
            let skip = (page - 1) * limit;
            const loggedInUser = req.user;
            //Need to filter those feed in which loggedIn User has sent or received the connectionRequest
            const findAlreadySentRequest = await ConnectRequestModel.find({
                $or: [
                    { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
                ]
            }).select("fromUserId toUserId");
            const hideUsersFromFeed = new Set();
            findAlreadySentRequest.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());

            })
            const findsUserFeed = await User.find({
                $and: [
                    { _id: { $nin: Array.from(hideUsersFromFeed) } },
                    { _id: { $ne: loggedInUser._id } }
                ]
            }).select(UserAllowedData).skip(skip).limit(limit);
            // console.log(hideUsersFromFeed);
            // const usersData = await User.find({});
            // if (!usersData) throw new Error('Users data not appear');
            res.status(200).send(findsUserFeed);
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
    // Get all the connections of the loggedIn userl
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
    },
    // Get all the ignored/rejected/interested connection request sendBy loggedIn User
    userRequestHistory: async (req, res) => {
        try {
            const loggedInUser = req.user;
            const ignoredRejectedRequest = await ConnectRequestModel.find({
                $or: [
                    { fromUserId: loggedInUser._id, status: 'ignored' },
                    { fromUserId: loggedInUser._id, status: 'rejected' },
                    { fromUserId: loggedInUser._id, status: 'interested' },


                ]
            }).populate('toUserId', UserAllowedData);
            console.log('data===', ignoredRejectedRequest);
            res.status(200).json({
                data: ignoredRejectedRequest
            })

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }

}

module.exports = userController