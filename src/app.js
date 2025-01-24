const express = require('express')
const app = express()

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
});

app.use("/test", (req,res)=>{
    res.send("Testing from server!")
})

app.use("/user", (req,res)=>{
    res.send("User request fulfilled!")
})

app.use("/", (req,res)=>{
    res.send("Hello from server!")
})  