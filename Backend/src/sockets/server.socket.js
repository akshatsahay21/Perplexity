import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    const defaultAllowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
    ];
    const envAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);
    const allowedOrigins = [ ...new Set([ ...defaultAllowedOrigins, ...envAllowedOrigins ]) ];

    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                const normalizedOrigin = origin.replace(/\/$/, "");
                const isVercelDomain = /^https:\/\/.*\.vercel\.app$/i.test(normalizedOrigin);
                const isAllowed = allowedOrigins.includes(normalizedOrigin) || isVercelDomain;

                if (isAllowed) return callback(null, true);
                return callback(new Error(`Socket CORS blocked origin: ${origin}`));
            },
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
