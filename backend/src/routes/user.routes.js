import express from "express";
import { getUsers, signupUser } from "../controllers/user.controller.js";

const routes = express.Router();

routes.get("/", getUsers);

routes.get("/sign-up", signupUser);

export default routes;
