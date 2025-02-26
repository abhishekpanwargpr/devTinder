const mongoose = require("mongoose");
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Required field, cannot be empty'],
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: [true, 'Required field, cannot be empty'],
        minLength: 4,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: {values: true, message: "Email field can't be left empty"},
        unique: true,
        lowercase: true,
        trim: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid email entered: "+val)
            }
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Entered password is weak"+val)
            }
        }
    },
    phone: {
        type: Number
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(val){
            if(!["male", "female", "others"].includes(val)){
                throw new Error("Gender is not valid");
            }
        },
        lowercase: true
    },
    about: {
        type: String,
        default: "This is a default about for a profile."
    },
    photoUrl : {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        validate(val){
            if(!validator.isURL(val)){
                throw new Error("Invalid photo url provided: "+val);
            }
        }
    },
    skills: {
        type: [String],
        default: undefined,
        validate(val){
            if(val.length > 10){
                throw new Error("Number of skills should be less than 10");
            }
        }
    }
}, {
    timestamps: true
})
userSchema.index({firstName: 1, lastName: 1})
userSchema.methods.getJWT = async function (){
    const userId = this._id;
    const token = await jwt.sign({_id: userId}, process.env.SECRET_KEY);
    return token
}

userSchema.methods.validatePassword = async function(password){
    const passwordHash = this.password;
    const isValidPassword = await bcrypt.compare(password, passwordHash)
    return isValidPassword;
}

const User = mongoose.model("User", userSchema);
module.exports = User;