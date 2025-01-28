const mongoose = require("mongoose")
const CONNECTION_URL = "mongodb+srv://ap759710:fLp8osAqt3gHgzG2@namastenode.xivzx.mongodb.net/devTinder"

const connectDb = async ()=>{
    await mongoose.connect(CONNECTION_URL);
}
module.exports = connectDb