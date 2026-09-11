import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { login , signUp } from "../controllers/dbuser.controller.js";
const router = express.Router();
app.get("/login",authMiddleware,login);
app.post("/register",signUp);
export default router;