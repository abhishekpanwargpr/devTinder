const validator = require('validator')
const validateSignUp = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        throw new Error("Please enter the mandatory field");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email entered")
    }
    if(firstName.length > 10){
        throw new Error("Maximum character limit exceeded")
    }
}

module.exports = {validateSignUp}