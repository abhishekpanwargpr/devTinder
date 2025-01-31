const express = require('express')
const requestRoute = express.Router();
const {userAuth} = require('../middlewares/userAuth')
requestRoute.post("/sendConnectionRequest", userAuth, async (req, res)=>{
    console.log("Sending connection request...")
    const user = req.user.firstName;
    res.send(user+" has sent a connection request")
})
module.exports = requestRoute