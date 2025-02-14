const express = require('express')
const profileRoute = express.Router();
const {userAuth} = require('../middlewares/userAuth');
const User = require('../models/user');
const {validateProfileData} = require('../utils/validateSignUp')
const validator = require('validator')
const bcrypt = require('bcrypt')
profileRoute.get("/profile/view", userAuth, (req, res)=>{
    try {
        const user = req.user;
        res.json({
            data: user
        });
    } catch (err) {
        res.send("Error: "+err.message)
    } 
})
profileRoute.patch("/profile/edit", userAuth, async (req, res)=>{
    try {
        if(!validateProfileData){
            throw new Error("Invalid edit request!")
        }
        const user = req.user;
        await User.findByIdAndUpdate(user._id, req.body);
        res.json({
            message: "Profile updated successfully!",
            data: user
        })
    } catch(err){
        res.status(500).send("Error: "+err.message)
    }
})

module.exports = profileRoute; 