const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const chatModel = require("../models/chat");
const chatRouter = express.Router();
chatRouter.get("/chat/:targetUserId",userAuth, async(req, res)=>{
    try {
        const userId = req.user._id;
        const {targetUserId} = req.params;
        let chat = await chatModel.findOne({
            participants: {$all:[userId, targetUserId]}
        }).populate({
            path: "messages.sender",
            select: "firstName lastName"
        });
        if(!chat){
            chat = new chatModel({participants: [userId, targetUserId], 
                messages: []
            })
            await chat.save();
        }
        res.json(chat);
    } catch (err) {
        console.log(err);
    }
})
module.exports = chatRouter