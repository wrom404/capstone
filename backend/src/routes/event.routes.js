import express from "express";
import { createEvent } from "../controllers/event.controller.js";

const routes = express.Router();

routes.post("/create-event", createEvent);


export default routes;