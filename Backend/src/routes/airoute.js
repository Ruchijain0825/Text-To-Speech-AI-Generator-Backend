import express from "express";
import { chatWithAI } from "../controllers/aicontroller.js";

const aiRouter = express.Router();

aiRouter.post("/chat", chatWithAI);

export default aiRouter;