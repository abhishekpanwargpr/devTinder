const express = require('express')
const profileRoute = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const User = require('../models/user');
profileRoute.get("/profile/view", userAuth, (req, res)=>{
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.send("Error: "+err.message)
    } 
})
profileRoute.patch("/profile/edit", userAuth, async (req, res)=>{
    try {
        const user = req.user;
        await User.findByIdAndUpdate(user._id, req.body);
        res.send("Profile edited successfully!")
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }
})
module.exports = profileRoute;