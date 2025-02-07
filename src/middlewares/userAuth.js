const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async (req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please Login again")
        }
        const decodedData = await jwt.verify(token, "Devop@Namaste123");
        const {_id} = decodedData;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User authentication failed")
        }
        req.user = user;
        next();
    } catch (err) {
        res.send("Error: "+err.message)
    }
}
module.exports = {userAuth}