import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use("/static", express.static(path.join(__dirname, "../public")));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tasklyst API is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

export default app;
