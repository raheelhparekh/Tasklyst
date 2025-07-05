import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express"

import authRoutes from "./routes/auth.routes.js"
import projectRoutes from "./routes/project.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import subtaskRoutes from "./routes/subtask.routes.js";

dotenv.config({
  path: "./.env",
});

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}))

app.use(express.json()) // accepts json values
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser())

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/subtask", subtaskRoutes);


connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));
  })
  .catch((err) => {
    console.error("mongo db connection error", err);
    process.exit(1);
  });
