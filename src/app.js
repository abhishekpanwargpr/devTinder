const express = require('express')
const bcrypt = require('bcrypt');
const validator = require('validator')
const app = express()
const connectDb = require("./configs/database")
const User = require("./models/user")
const {validateSignUp} = require('./utils/validateSignUp');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
connectDb()
    .then(()=>{
        console.log("Database connection established...")
        app.listen(7777, ()=>{
        console.log("Server listening on port 7777")
    })})
    .catch((err)=>{
        console.log("Error while connecting!")
    })
app.use("/", express.json());
app.use(cookieParser());
app.post("/signUp",async (req, res)=>{
    // console.log(req.body);
    const {firstName, lastName, emailId, password} = req.body
    try {
        // if(req.body.skills.length > 10){
        //     throw new Error("Too much skills passed!")
        // }
        //Validate the data
        validateSignUp(req);
        const password = req.body.password;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
    const user = new User({
        firstName, lastName, emailId, password: passwordHash
    })
        await user.save();
        res.send("Succesfully added user");  
    } catch (error) {
        res.status(501).send("Error while adding user: "+error.message)
    }
})

app.post("/login", async (req, res)=>{
    const {emailId, password} = req.body;
    
    try {
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid credentials entered!");
        }
        const user = await User.findOne({emailId: emailId})
        const isValidPassword = bcrypt.compare(password, user.password);

        if(!isValidPassword){
            throw new Error("Password not matched")
        }
        else{
            const token = await jwt.sign({_id: user._id}, "Devop@Namaste123")
            res.cookie("token", token);
            res.send("Login successfull!");
        }
    } catch (err) {
        res.status(500).send("Error: "+err.message)
    }
})
app.get("/profile", async (req, res)=>{

    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid token please login again")
        }
        const decodedMessage = await jwt.verify(token, "Devop@Namaste123");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("No user found")
        }
        res.send(user);
    } catch (err) {
        res.send("Error: "+err.message)
    }    
})
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({emailId: userEmail})
        if(!user){
            res.status(404).send("User not found")
        }
        else{
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong!")
    }
})

app.get("/feed", async (req,res)=>{
    try {
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send("No user find");
        }
        else{
            res.send(users);   
        }
    } catch (error) {
        res.status(500).send("Something went wrong!")
    }
})

app.delete("user", async (req, res)=>{
    const userId = req.body.userId;
    try {
        const delUser = await User.findByIdAndDelete(userId);
        console.log(delUser);
        if(!delUser){
            res.send("No such user exist!")
        }
        else{
            res.send("Deleted the user succcessfully!")
        }
    } catch (err) {
        res.status(500).send("User Not Added: "+err.message)
    }
}) 

app.patch("/user", async (req, res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndUpdate(userId, req.body, {returnDocument: "after", runValidators: true});
        console.log(user);
        res.send("User profile updated successfully...")
    } catch (err) {
        res.status(500).send("Update Filled: "+err.message)
    }
})

app.patch("/userId", async (req, res)=>{
    const userEMail = req.body.emailId;
    try {
        const user = await User.findOneAndUpdate({emailId: userEMail}, req.body);
        res.send("User profile updated succesfully...");
    } catch (err) {
        res.status(500).send("Sonething went wrong!");
    }
})
// app.use("/getUser", (req,res)=>{
//         throw new Error("abdasessss")
//         res.send("Request send")
//         // res.status(500).send(err.type)
// })

// app.use("/", (err, req, res, next)=>{
//     if(err){
//         res.status(500).send("Something went wrong!")
//     }
// })

//Order matters most
// app.use("/test", (req,res)=>{
//     res.send("Testing from server!")
// })

// app.use("/get", (req,res, next)=>{
//     console.log("Sending response...")
//     next();
//     res.send("Response1!")
// },
// (req, res, next)=>{
//     console.log("Sending response...")
//     res.send("Response2!")
// })
// app.get("/user", (req,res)=>{
//     console.log(req.query);
//     res.send({"first_name": "Abhishek Panwar", "Age": 21})
// })

// app.get("/user/:userId/:userName", (req, res)=>{
//     console.log(req.params);
//     res.send("User request fulfilled!")
// })


// app.post("/user", (req,res)=>{
//     console.log(req.query)
//     res.send("Saved useruuu information succesfully!")
// })

// app.delete("/user", (req, res)=>{
//     res.send("Deleted user info successfully!")
// }) 


// app.get("/user/login", (req, res)=>{
//     res.send("Login successfull");
// })

// app.get("/user/data", userAuth, (req, res)=>{
//     res.send("Getting requested data..")
// })

//Admin auth code
// app.get("/admin", adminAuth);

// app.get("/admin/getData", (req,res)=>{
//     res.send("Data successfully send...")
// })

// app.get("/admin/getUserInfo", (req, res)=>{
//     res.send("Getting user info...")
// })
// app.use("/", (req,res)=>{
//     res.send("Hello from server!")
// })

//This will redirect all the requests method i.e. GET, POST, PUT, DELETE etc. to "/user"
// app.use("/user", (req,res)=>{
//     res.send("User request fulfilled!")
// })

