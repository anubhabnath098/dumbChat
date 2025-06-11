const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const socket = require("socket.io")

const app=express();
require('dotenv').config();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://chat-app-blond-nine.vercel.app"

]

app.use(cors({
    origin: allowedOrigins,
    methods:["GET", "POST"],
    credentials: true
}));

app.use(express.json())

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoute)

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB Connection Successful")
}).catch((err)=>{
    console.log("Error-->",err.message);
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
})


const io=socket(server,{
    cors:{
        origin:allowedOrigins,
        credentials:true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId,socket.id)
    })

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(`Sending message to user: ${data.to}, socket: ${sendUserSocket}`);
        if(sendUserSocket){
          // console.log(data);
            socket.to(sendUserSocket).emit("msg-receive", {message:data.message, image:data.image});
            console.log(`Message sent to user: ${data.to}`);
        }
       else {
          console.log(`User with ID ${data.to} is not online.`);
      }
    });
})

