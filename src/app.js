const express = require('express')
const app = express()

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
});

app.use("/test", (req,res)=>{
    res.send("Testing from server!")
})

app.get("/user", (req,res)=>{
    res.send({"first_name": "Abhishek Panwar", "Age": 21})
})

app.post("/user", (req,res)=>{
    res.send("Saved user information succesfully!")
})

app.delete("/user", (req, res)=>{
    res.send("Deleted user info successfully!")
}) 
// app.use("/", (req,res)=>{
//     res.send("Hello from server!")
// })

//This will redirect all the requests method i.e. GET, POST, PUT, DELETE etc. to "/user"
// app.use("/user", (req,res)=>{
//     res.send("User request fulfilled!")
// })

