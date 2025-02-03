const mongoose = require('mongoose');
const conncectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.ObjectId,
        required: true,
        ref: "User",
    },
    status:{
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not supported`
        },
        required: true,
    }
},
{
    timestamps: true,
})

conncectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself!!")
    }
    next();
})
conncectionRequestSchema.index({fromUserId: 1, toUserId: 1})

const connectionRequest = mongoose.model("connectionRequest", conncectionRequestSchema);

module.exports = {connectionRequest}