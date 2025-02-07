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
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;

        let skip = (page-1)*limit;
        skip = skip>50 ? 50:skip;
        
        const connections = await connectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        const hiddenUsers = new Set();
        connections.forEach((user)=>{
            hiddenUsers.add(user.toUserId.toString());
            hiddenUsers.add(user.fromUserId.toString());
        })
        
        const feedUsers = await User.find({
            $and: [
                {_id: {$nin: Array.from(hiddenUsers)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(SAFE_DATA)
          .skip(skip)
          .limit(limit)

        res.json({
            data: feedUsers
        })
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})
module.exports = {userRoute};