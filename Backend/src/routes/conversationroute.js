import express from "express";

import {
  createConversation,
  getUsers,
  getMessages,
  getConversationHistory,
  saveConversation,
  unsaveConversation,
  checkSavedConversation,
  getSavedConversations
} from "../controllers/conversationcontroller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", authMiddleware, getUsers);

router.post("/create", authMiddleware, createConversation);

router.get(
  "/messages/:conversationId",
  authMiddleware,
  getMessages
);

router.get(
  "/history",
  authMiddleware,
  getConversationHistory
);

router.post(
    "/save",
    authMiddleware,
    saveConversation
);

router.delete(
    "/save/:conversationId",
    authMiddleware,
    unsaveConversation
);

router.get(
    "/save/:conversationId",
    authMiddleware,
    checkSavedConversation
);

router.get(
    "/saved",
    authMiddleware,
    getSavedConversations
);
export default router;

