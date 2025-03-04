import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/auth", userRoutes);

app.use("/api/", eventRoutes);

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
