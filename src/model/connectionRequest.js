const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
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

const ConnectRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequest);
module.exports = ConnectRequestModel;