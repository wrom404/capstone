import express from "express";
import { logoutUser, signupUser, loginUser } from "../controllers/user.controller.js";

const routes = express.Router();


routes.post("/sign-up", signupUser);

routes.post("/login", loginUser);

routes.post("/logout", logoutUser);

export default routes;
