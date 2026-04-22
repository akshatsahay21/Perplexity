import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

const port = process.env.PORT || 8000;

connectToDb()
.catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
testAi();