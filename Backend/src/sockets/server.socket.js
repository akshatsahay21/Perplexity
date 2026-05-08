import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    io = new Server(httpServer, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        },
    })

    console.log("Socket.io initialized");

    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);
    });   
}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
