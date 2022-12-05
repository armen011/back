const broadCast = require("./actions/broadCast");
const { sendMessage } = require("./actions/messageActions");

const activeUsers = new Map();

module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.emit("connected");
    socket.on("setUserId", ({ userId }) => {
      if (!activeUsers.get(socket.id)) {
        console.log("Socket(New User)", userId);
        activeUsers.set(socket.id, { userId });
        console.log(activeUsers);
      }
    });

    socket.on("sendMessage", (data) => {
      sendMessage(data).then(([ids, sendData]) => {
        broadCast(io, activeUsers, ids, "newMessage", sendData);
      });
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected", socket.id);
      activeUsers.delete(socket.id);
    });
  });
};
