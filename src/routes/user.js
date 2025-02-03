const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const userRoute = express.Router();
const {connectionRequest} = require('../models/connectionRequest')
const SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "skills", "gender", "about"]
const User = require('../models/user')
userRoute.get("/user/requests/received", userAuth, async(req, res)=>{
    try {
        const user = req.user;
        const allRequests = await connectionRequest.find({
            toUserId: user._id,
            status: "interested"
        }).populate("fromUserId", SAFE_DATA)
        res.json({
            message:"Showing all the connection requests",
            allRequests
        })
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }
})
userRoute.get("/user/connections", userAuth, async (req, res)=>{
    try {
        const loggedInUser = req.user;
        const toUserConnections = await connectionRequest.find({
            toUserId: loggedInUser._id, status: "accepted"
        }).populate("fromUserId", SAFE_DATA);

        const fromUserConnections = await connectionRequest.find({
            fromUserId: loggedInUser._id, status: "accepted"
        }).populate("toUserId", SAFE_DATA);

        const data1 = toUserConnections.map(log=>log.fromUserId);
        const data2 = fromUserConnections.map(log=>log.toUserId);
        const data = data1.concat(data2);
        res.json({
            data
        })
    } catch (err) {
        res.status(400).send({message: "Error: "+ err})
    }
})
userRoute.get("/user/feed", userAuth, async(req, res)=>{
    try {
        const loggedInUser = req.user;
        const allUsers = await User.find({});
        const filteredUsers = allUsers.map(user=>user._id !== loggedInUser._id)
        res.json({
            data: filteredUsers
        })
    } catch (err) {
        res.status(400).send("Error: "+err.message)
    }
})
module.exports = {userRoute};