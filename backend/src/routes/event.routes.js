import express from "express";
import { createEvent, getEvents, getEventById } from "../controllers/event.controller.js";

const routes = express.Router();

routes.post("/create-event", createEvent);

routes.get("/", getEvents);

routes.get("/:id", getEventById);

export default routes;
