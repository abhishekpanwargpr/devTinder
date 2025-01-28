const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: String,
    emailId: String,
    password: String,
    phone: {
        type: Number
    },
    age: Number,
    gender: String
})
const User = mongoose.model("User", userSchema);
module.exports = User