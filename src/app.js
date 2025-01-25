const express = require('express')
const app = express()
const {adminAuth} = require('../middlewares/adminAuth')
const {userAuth} = require("../middlewares/userAuth")
app.listen(3000, ()=>{
    console.log("Server running on port 3000")
});

//Order matters most


app.use("/test", (req,res)=>{
    res.send("Testing from server!")
})

app.use("/get", (req,res, next)=>{
    console.log("Sending response...")
    next();
    res.send("Response1!")
},
(req, res, next)=>{
    console.log("Sending response...")
    res.send("Response2!")
})
// app.get("/user", (req,res)=>{
//     console.log(req.query);
//     res.send({"first_name": "Abhishek Panwar", "Age": 21})
// })

app.get("/user/:userId/:userName", (req, res)=>{
    console.log(req.params);
    res.send("User request fulfilled!")
})


app.post("/user", (req,res)=>{
    console.log(req.query)
    res.send("Saved useruuu information succesfully!")
})

app.delete("/user", (req, res)=>{
    res.send("Deleted user info successfully!")
}) 


app.get("/user/login", (req, res)=>{
    res.send("Login successfull");
})

app.get("/user/data", userAuth, (req, res)=>{
    res.send("Getting requested data..")
})

//Admin auth code
app.get("/admin", adminAuth);

app.get("/admin/getData", (req,res)=>{
    res.send("Data successfully send...")
})

app.get("/admin/getUserInfo", (req, res)=>{
    res.send("Getting user info...")
})
// app.use("/", (req,res)=>{
//     res.send("Hello from server!")
// })

//This will redirect all the requests method i.e. GET, POST, PUT, DELETE etc. to "/user"
// app.use("/user", (req,res)=>{
//     res.send("User request fulfilled!")
// })

