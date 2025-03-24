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
  getEventsStatusCount,
  getRecentEvents,
  getEventsFromLastMonth
} from "../controllers/event.controller.js";
import verifyUser from "../middleware/verifyUser.js";

const routes = express.Router();

routes.use(verifyUser);

routes.post("/create-event", createEvent);

routes.get("/", getEvents);

routes.get("/unavailable-date", getUnavailableDates);

routes.get("/canceled/events", getCanceledEvents);

routes.get("/events/counts", getEventsStatusCount)

routes.get("/events/recent", getRecentEvents);

routes.get("/event/last-month", getEventsFromLastMonth)

routes.get("/:id", getEventById);

routes.put("/:id", updateEvent);

routes.delete("/:id", deleteEvent);

routes.put("/:id/cancel", cancelEvent);

routes.put("/:id/restore", restoreCanceledEvent);

export default routes;
