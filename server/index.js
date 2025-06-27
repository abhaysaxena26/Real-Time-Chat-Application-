const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
const axios = require("axios");

const app = express();
require("dotenv").config();



// Middlewares
app.use(cors());
app.use(express.json());



// MongoDB Connection
const connectodb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connection established with host ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDb server Connection issue ${error}`);
  }
};



connectodb();



// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

// Avatar Proxy Route
app.use("/api/avatar", avatarRoutes);




// Start Server
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);




// Socket.IO Setup
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("New socket connection established");
  console.log(global.onlineUsers);

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
