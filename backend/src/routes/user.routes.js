import express from "express";
import { logoutUser, signupUser, loginUser, currentUser, getUsers } from "../controllers/user.controller.js";

const routes = express.Router();


routes.post("/sign-up", signupUser);

routes.post("/login", loginUser);

routes.get('/current-user', currentUser)

routes.get('/users', getUsers)

routes.post("/logout", logoutUser);

export default routes;
