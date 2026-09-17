import express from "express";
import { createConversation,getUsers,getMessages } from "../controllers/conversationcontroller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
const router = express.Router();
router.get("/users",authMiddleware,getUsers);
router.post("/create",authMiddleware,createConversation);
router.get("/messages/:conversationid",authMiddleware,getMessages);
export default router;