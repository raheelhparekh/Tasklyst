import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./db/db.js";
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express"

dotenv.config({
  path: "./.env",
});

app.use(cors({
    origin:"*",
    methods:["GET","POST","UPDATE","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}))

app.use(express.json()) // accepts json values
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser())

const PORT = process.env.PORT || 8000;

app.use("/api/v1/auth",authRoutes)

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));
  })
  .catch((err) => {
    console.error("mongo db connection error", err);
    process.exit(1);
  });
