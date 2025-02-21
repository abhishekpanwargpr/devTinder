const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type: String,
        required: true,
    }
}, {timestamps: true})
const chatSchema = new mongoose.Schema({
    participants: [{type: mongoose.ObjectId, required:true, ref: "User"}],
    messages: [messageSchema]
})

const chatModel = mongoose.model("Chat", chatSchema);
module.exports = chatModel;