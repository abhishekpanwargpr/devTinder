const socket = require('socket.io');
const chatModel = require('../models/chat');
const initializeSocket = (server)=>{
    const io = socket(server, {
        cors: {
            origin:"http://localhost:5173",
        }
    })

    io.on("connection",(socket)=>{
        socket.on("joinChat",({userId, targetUserId})=>{
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId);
        });

        socket.on("sendMessage", async({firstName, userId, targetUserId, text})=>{
            const roomId = [userId, targetUserId].sort().join("_");
            io.to(roomId).emit("messageReceived", {firstName, text})
            try {
                let chat = await chatModel.findOne({
                    participants: {$all: [userId, targetUserId]}
                })
                if(!chat){
                    chat = new chatModel({participants: [userId, targetUserId],
                        messages: []
                    })
                }
                chat.messages.push({sender: userId, text})
                await chat.save();
            } catch (err) {
                console.error("Error: "+err)
            }
        });
        
        socket.on("disconnect", ()=>{
            
        });
    })
}
module.exports = {initializeSocket}