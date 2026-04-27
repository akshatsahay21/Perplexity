import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectToDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";


const port = process.env.PORT || 8000;

const httpServer = http.createServer(app);

connectToDb()
.catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
