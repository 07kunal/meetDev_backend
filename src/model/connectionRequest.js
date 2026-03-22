const mongoose = require('mongoose');
// ref: help to create the reference with the another schema here it User
const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        default: "ignored"
    }

},
    {
        timestamps: true
    }
);
connectionRequest.index({ fromUserId: 1, toUserId: 1 });
// Pre is helpful to put schema level validation work as middleware
connectionRequest.pre('save', function (next) {
    const connectionRequestFind = this;
    if (connectionRequestFind.fromUserId.equals(connectionRequestFind.toUserId)) {
        throw new Error("Cannot send the connection request to yourself");
    }
    next();
});
const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequest);
module.exports = ConnectionRequestModel;