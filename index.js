const express = require("express");
const socketServer = require('socket.io');
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const chatRoute = require("./routes/chat");
const socket = require('./socket');


dotenv.config();

mongoose.connect(process.env.MONGO_URL, (err) => {
  if (err) throw err;
  console.log("conected to server");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chat", chatRoute);

const server=app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running");
});



const  io = socketServer(server,{cors:{origin:"*"}})
socket(io)

