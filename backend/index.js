import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors"; // Import the cors middleware
import Connection from "./db.js";
import {
  getDocument,
  updateDocument,
} from "./controller/document-controller.js";

const PORT = process.env.PORT || 9000;

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Allow requests from http://localhost:3000

const server = createServer(app);
const io = new Server(server, {
  /* Your socket.io configuration */
  cors: {
    origin: "http://localhost:3000", // Allow requests from http://localhost:3000
    methods: ["GET", "POST"],
  },
});

Connection(); // Assuming this function sets up your database connection

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await getDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
