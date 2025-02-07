const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')
const validator = require('validator');
authRouter.post("/signUp", async (req, res)=>{
    try {
        const {firstName, lastName, emailId, password} = req.body;
        const emailUser = await User.findOne({emailId: emailId});
        if(emailUser){
            res.status(400).send("Already registered with this email!")
        }
        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = await User({firstName, lastName, emailId, password: passwordHash})
        await user.save();
        res.send("Successfully addded user...")
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }
})

authRouter.post("/login", async (req, res)=>{
    try {
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)){
        throw new Error("Invalid email entered");
        }
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("User not found!")
        }
        const isValidPassword = await user.validatePassword(password)
        if(isValidPassword){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.json({
                data: user
            })
        }
        else{
            throw new Error("Password not matched")
        }
    } catch (err) {
        res.status(400).send("Error: "+err.message)
    }   
})

authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Logout successfull!")
})
module.exports = authRouter;