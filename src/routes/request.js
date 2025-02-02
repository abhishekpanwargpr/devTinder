const express = require('express')
const requestRoute = express.Router();
const {userAuth} = require('../middlewares/userAuth')
const {connectionRequest} = require('../models/connectionRequest');
const User = require('../models/user');
requestRoute.post("/request/send/:status/:toUserId", userAuth, async (req, res)=>{
    try {
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.toUserId
        const status = req.params.status;
        const validStatus = ["ignored", "interested"]
        if(!validStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: "+ status})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message: "Invalid connection request"
            })
        }

        const existingConnection = await connectionRequest.findOne({
            $or: [
                  {fromUserId, toUserId},
                  {fromUserId: toUserId, toUserId: fromUserId}
                 ]
        })
        if(existingConnection){
            res.status(400).json({message: "Connection request already exists!"})
        }

        const request = new connectionRequest({fromUserId, toUserId, status});
        const data = await request.save();
        res.json({
            message: "Connection request added successfully",
            data
        })
    } catch(err){
        res.status(400).send("Error: "+err.message)
    }
})
module.exports = requestRoute