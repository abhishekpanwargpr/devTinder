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
        res.send(user);
    } catch (err) {
        res.send("Error: "+err.message)
    } 
})
profileRoute.patch("/profile/edit", userAuth, async (req, res)=>{
    try {
        if(!validateProfileData){
            throw new Error("Invalid edit data")
        }
        const user = req.user;
        await User.findByIdAndUpdate(user._id, req.body);
        res.send("Profile edited successfully!")
    } catch(err){
        res.status(500).send("Error: "+err.message)
    }
})

profileRoute.patch("/profile/password", userAuth, async(req, res)=>{
    try {
        const {password} = req.body;
        const user = req.user;
        if(!validator.isStrongPassword(password)){
            throw new Error("Password is not strong: "+password);
        }
        const newPasswordHash = await bcrypt.hash(password, 10);
        user.password = newPasswordHash;
        await user.save();
        res.send("Password changed successfully!")
    } catch (err) {
        res.status(500).send("Error: "+err.message);
    }
    
})
module.exports = profileRoute; 