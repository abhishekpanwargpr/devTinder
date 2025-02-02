const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')
const validator = require('validator');
const { now } = require('mongoose');
authRouter.post("/signUp", async (req, res)=>{
    try {
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = await User({firstName, lastName, emailId, password: passwordHash})
        await user.save();
        res.send("Successfully addded user...")
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }
    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User({firstName, lastName, emailId, password: passwordHash})
    await user.save();
})

authRouter.post("/login", async (req, res)=>{
    try {
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
        throw new Error("Invalid email entered");
        }
        const user = await User.findOne({emailId: emailId});
        const isValidPassword = await user.validatePassword(password)
        if(isValidPassword){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login successfull");
        }
        else{
            throw new Error("Password not matched")
        }
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }   
})

authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Logout successfull!")
})
module.exports = authRouter;