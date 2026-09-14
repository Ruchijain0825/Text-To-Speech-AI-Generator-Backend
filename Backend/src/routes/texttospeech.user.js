
import express from "express"
import { getVoices,generateSpeech, } from "../controllers/texttospeechconvertor.js";
const router = express.Router();
router.get("/voices",getVoices);

router.post("/generate",generateSpeech);
export default router;