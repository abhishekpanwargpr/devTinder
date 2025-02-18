const cron = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns');
const { connectionRequest } = require('../models/connectionRequest');
const { run } = require('./sendEmail');
cron.schedule('0 10 * * *', async()=>{
    try {
        const yesterday = subDays(new Date(),1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await connectionRequest.find({
            status: "interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("toUserId")
        const listOfEmails = [...new Set(pendingRequests.map((user)=>user.toUserId.emailId))];

        for(const email of listOfEmails){
            const emailSent = await run("You have pending connection requests on devTinder. Review & stay connected", `Pending connection requests for ${email}`)
        }
    } catch (err) {
        console.error(err.request.data)
    }
})