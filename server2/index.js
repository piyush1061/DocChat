const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userCounts = {}; // Object to store user counts for each room
const userMaps = {}; // Object to store user maps for each room

// Custom CORS handling for Socket.IO
io.engine.on("headers", (headers) => {
  headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
  headers["Access-Control-Allow-Methods"] = "GET,POST";
  headers["Access-Control-Allow-Headers"] = "my-custom-header";
  headers["Access-Control-Allow-Credentials"] = "true";
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    if (!userCounts[roomId]) {
      userCounts[roomId] = 0;
      userMaps[roomId] = new Map();
    }

    userCounts[roomId]++;
    userMaps[roomId].set(socket.id, `User${userCounts[roomId]}`);

    const currentUser = userMaps[roomId].get(socket.id);

    socket.join(roomId);

    // Welcome message to the new user
    socket.emit("message", `Hi! Welcome ${currentUser}`);

    // Notify all users about the new user
    io.to(roomId).emit(
      "message",
      `${currentUser} has joined. ${userCounts[roomId]} users online.`
    );

    socket.on("send-message", (message) => {
      const userMessage = `${currentUser}: ${message}`;
      io.to(roomId).emit("receive-message", userMessage);
    });

    socket.on("disconnect", () => {
      userMaps[roomId].delete(socket.id);
      userCounts[roomId]--;
      io.to(roomId).emit(
        "message",
        `${currentUser} has left. ${userCounts[roomId]} users online.`
      );
    });
  });
});

server.listen(9001, () => {
  console.log("Chat server listening on *:9001");
});
