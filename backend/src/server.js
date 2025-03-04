import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use("/auth", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
