import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import verifyUser from "../middleware/verifyUser.js";

const routes = express.Router();

routes.use(verifyUser);

console.log("Before ni sud sa create event");
routes.post("/create-event", createEvent);

routes.get("/", getEvents);

routes.get("/:id", getEventById);

routes.put("/:id", updateEvent);

routes.delete("/:id", deleteEvent);

export default routes;
