const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const  userRoutes  = require("./routes/userRoutes");
const socket = require('socket.io')
const messagesRoutes = require("./routes/messagesRoutes")

const app = express();


require("dotenv").config();


app.use(cors());
app.use(express.json());

const connectodb = async ()=>{
 
    try{

    await mongoose.connect(process.env.MONGO_URL)
    console.log(`connection established with host ${mongoose.connection.host}`)
    }catch(error){

        console.log(`MongoDb server Connection issue ${error}`)
    }
}


connectodb();

app.use('/api/auth',userRoutes)
app.use('/api/messages',messagesRoutes )


const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );

  //socket(server): Initializes a new Socket.IO instance, where server is an HTTP server object.
//cors: Configures Cross-Origin Resource Sharing (CORS) to allow requests from http://localhost:3000,
// enabling the frontend to connect to the Socket.IO server. credentials: true allows cookies to be sent with requests.

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });


  //global.onlineUsers: A globally accessible Map object that stores the mapping of user IDs to their respective socket IDs.
  // This is used to keep track of which users are currently online.
  
  global.onlineUsers = new Map();



 // io.on("connection", (socket) => {...}): Sets up an event listener for new socket connections. When a user connects, 
 //the callback function is executed, and the connected socket is passed as an argument.


  io.on("connection", (socket) => {
    global.chatSocket = socket;
    console.log(global.onlineUsers)
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });