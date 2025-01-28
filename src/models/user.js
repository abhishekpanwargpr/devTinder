const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Required field, cannot be empty'],
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: {values: true, message: "Email field can't be left empty"},
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
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
    description: {
        type: String,
        default: "This is a default description for given schema"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})
const User = mongoose.model("User", userSchema);
module.exports = User