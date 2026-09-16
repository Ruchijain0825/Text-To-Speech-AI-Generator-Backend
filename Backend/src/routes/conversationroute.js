import express from "express";
import { createConversation,getUsers } from "../controllers/conversationcontroller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
const router = express.Router();
router.get("/users",authMiddleware,getUsers);
router.post("/create",authMiddleware,createConversation);
export default router;