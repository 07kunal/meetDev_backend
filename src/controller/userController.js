const ConnectionRequestModel = require('../model/connectionRequest');
const { User } = require('../model/user');

const UserAllowedData = ["firstName", "lastName", "gender", "age", "skills", "profilePic", "education"];
const userController = {
    userFeeds: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit < 50 ? limit : 10
            let skip = (page - 1) * limit;
            const loggedInUser = req.user;
            //Need to filter those feed in which loggedIn User has sent or received the connectionRequest
            const findAlreadySentRequest = await ConnectionRequestModel.find({
                $or: [
                    { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
                ]
            }).select("fromUserId toUserId");
            const hideUsersFromFeed = new Set();
            findAlreadySentRequest.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());

            });
            const findsUserFeedCount = await User.countDocuments({
                $and: [
                    { _id: { $nin: Array.from(hideUsersFromFeed) } },
                    { _id: { $ne: loggedInUser._id } }
                ]
            });
            console.log('totalCount', findsUserFeedCount);
            const findsUserFeed = await User.find({
                $and: [
                    { _id: { $nin: Array.from(hideUsersFromFeed) } },
                    { _id: { $ne: loggedInUser._id } }
                ]
            }).select(UserAllowedData).skip(skip).limit(limit);
            if (findsUserFeed.length <= 0) {
                return res.status(200).json({
                    message: 'No Feed to shows',
                    data: [],
                    totalCount: findsUserFeedCount,
                    page: page,
                    limit: limit
                });
            }
            // res.status(200).send(findsUserFeed);
            res.status(200).json({
                message: 'User feed',
                totalCount: findsUserFeedCount,   // e.g. 12
                page: page,                      // e.g. 1
                limit: limit,                     // e.g. 10
                data: findsUserFeed               // actual user records
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get all the pending request ( as recevied as intereset) for the loggedin request.
    userPendingRequest: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit < 50 ? limit : 10
            let skip = (page - 1) * limit;
            let loggedInUser = req.user;
            // Get total count first
            const totalPendingRequestCount = await ConnectionRequestModel.countDocuments({
                toUserId: loggedInUser._id,
                status: 'interested'
            });
            let loggedInUserPendingRequest = await ConnectionRequestModel.find({
                toUserId: loggedInUser._id,
                status: 'interested'
            }).populate("fromUserId", UserAllowedData).skip(skip).limit(limit);

            if (loggedInUserPendingRequest.length <= 0) {
                return res.status(200).json({
                    message: 'No pending connection request',
                    data: [],
                    totalCount: totalPendingRequestCount,
                    page: page,
                    limit: limit
                });
            }

            res.status(200).json({
                message: 'Following are the pending requests',
                data: loggedInUserPendingRequest,
                totalCount: totalPendingRequestCount,
                page: page,
                limit: limit
            });
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
            let myConnections = await ConnectionRequestModel.find({
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
            // Include both connected user and requestId
            const data = myConnections.map(item => {
                const connectedUser = item.fromUserId._id.toString() === loggedInUser._id.toString()
                    ? item.toUserId
                    : item.fromUserId;

                return {
                    requestId: item._id,   // connection request ID
                    user: connectedUser    // connected user data
                };
            });

            res.status(200).json({
                message: 'Logged in connections',
                data
            });

        } catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
    },
    // user send the connection request 

    userRequestHistory: async (req, res) => {
        try {
            const loggedInUserId = req.user._id;
            const [
                ignoredByMe,
                sentInterested,
                rejectedByMe,
                rejectedMe
            ] = await Promise.all([

                // ✅ FIXED: ignored is fromUserId
                ConnectionRequestModel.find({
                    fromUserId: loggedInUserId,
                    status: "ignored"
                }).populate("toUserId", UserAllowedData),

                // interested sent
                ConnectionRequestModel.find({
                    fromUserId: loggedInUserId,
                    status: "interested"
                }).populate("toUserId", UserAllowedData),

                // rejected by logged-in user (incoming)
                ConnectionRequestModel.find({
                    toUserId: loggedInUserId,
                    status: "rejected"
                }).populate("fromUserId", UserAllowedData),

                // user got rejected
                ConnectionRequestModel.find({
                    fromUserId: loggedInUserId,
                    status: "rejected"
                }).populate("toUserId", UserAllowedData)

            ]);
            res.json({
                success: true,
                data: {
                    ignoredByMe,
                    sentInterested,
                    rejectedByMe,
                    rejectedMe
                }
            });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

}

module.exports = userController