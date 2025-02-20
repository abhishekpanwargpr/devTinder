require('dotenv').config();
const express = require('express')
const app = express()
const connectDb = require("./configs/database")
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const validator = require('./utils/validateSignUp')
const { userRoute } = require('./routes/user')
const cors = require('cors')
const http = require('http');
require('./utils/cronJobs');
const server = http.createServer(app);
const {initializeSocket} = require('./utils/intializeSocket') 
initializeSocket(server);
connectDb()
    .then(()=>{
        console.log("Database connection established...")
        server.listen(process.env.PORT, ()=>{
        console.log("Server listening on port 7777")
    })})
    .catch((err)=>{
        console.log("Error while connecting!")
    })

app.use("/", express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/", authRouter);
app.use("/", profileRouter)
app.use("/", requestRouter);
app.use("/", userRoute);