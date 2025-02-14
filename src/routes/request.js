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
            message: `${user.firstName} sent a ${status} connection request to ${toUser.firstName}`,
            data
        })
    } catch(err){
        res.status(400).send("Error: "+err.message)
    }
})
requestRoute.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{
    try {
        const toUser = req.user;
        const fromUserId = req.params.requestId;
        const toUserId = toUser._id;
        const status = req.params.status;

        const validStatus = ["accepted", "rejected"];
        if(!validStatus.includes(status)){
            res.status(400).json(
                {message: "Status not valid!"}
            )
        }

        const connectionRequestDb = await connectionRequest.findOne({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: "interested",
        })
        
        if(!connectionRequestDb){
            res.status(404).json(
                {message: "Connection Request not found!"}
            )
        }

        connectionRequestDb.status = status;
        const data = await connectionRequestDb.save();
        res.json({
            message: "Connection request "+status+" succesfully!",
            data
        })
    } catch(err) {
        res.status(500).send("Error: "+err.message)
    }
})
module.exports = requestRoute