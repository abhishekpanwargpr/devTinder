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

const validateProfileData = (req)=>{
        if(!validator.isURL(req.body.photoUrl)){
            throw new Error("Invalid url!")
        }

        if(req.body.skills.length > 10){
            throw new Error("Skills not allowed more than 10")
        }
        const fields = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]
        const isValidEditField = Object.keys(req.body).each(field=>fields.includes(field))
        return isValidEditField;
}
module.exports = {validateSignUp, validateProfileData}