import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import logger from "./middleware/logger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./jobs/updateEventStatus.js";
import "./jobs/sendReminderEmails.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser());

app.use(logger);

app.use("/api/auth", userRoutes);

app.use("/api/event", eventRoutes);

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
