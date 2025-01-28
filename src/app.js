const express = require('express')
const app = express()
const connectDb = require("./configs/database")
const User = require("./models/user")
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
app.post("/signUp",async (req, res)=>{
    // const userDummy = {firstName: "Abhishek", 
    //                    lastName: "Panwar",
    //                    emailId: "apnwr1046@gmail.com",
    //                    password: "Abhip1234",
    //                    phone : 34919373893,
    //                    age: 21,
    //                    gender: "Male"
                       
    // }
    // console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        res.send("Succesfully added user");  
    } catch (error) {
        res.status(501).send("Error while adding user: "+error.message)
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
        res.status(500).send("Something went wrong!")
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

