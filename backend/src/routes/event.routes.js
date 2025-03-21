import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUnavailableDates,
  cancelEvent,
  getCanceledEvents,
  restoreCanceledEvent,
} from "../controllers/event.controller.js";
import verifyUser from "../middleware/verifyUser.js";

const routes = express.Router();

routes.use(verifyUser);

routes.post("/create-event", createEvent);

routes.get("/", getEvents);

routes.get("/unavailable-date", getUnavailableDates);

routes.get("/canceled/events", getCanceledEvents);

routes.get("/:id", getEventById);

routes.put("/:id", updateEvent);

routes.delete("/:id", deleteEvent);

routes.put("/:id/cancel", cancelEvent);

routes.get("/:id/restore", restoreCanceledEvent);

export default routes;
