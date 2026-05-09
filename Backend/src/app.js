import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
const defaultAllowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
];

const envAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const allowedOrigins = [ ...new Set([ ...defaultAllowedOrigins, ...envAllowedOrigins ]) ];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (no origin header)
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/$/, "");
        const isVercelDomain = /^https:\/\/.*\.vercel\.app$/i.test(normalizedOrigin);
        const isAllowed = allowedOrigins.includes(normalizedOrigin) || isVercelDomain;

        if (isAllowed) return callback(null, true);

        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
export default app;
