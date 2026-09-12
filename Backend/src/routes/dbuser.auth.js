import express from "express";

import { googleCallback, login , signUp ,forgotPassword, verifyOTP } from "../controllers/dbuser.controller.js";

import passport from "../config/googleOAuth.js";
const router = express.Router();
router.post("/login",login);
router.post("/register",signUp);
router.get("/google",passport.authenticate("google",{scope:["profile","email"],session:false}))
router.get("/google/callback",passport.authenticate("google",{session:false,failureRedirect:`${process.env.FRONTEND_URL}/login?error=google_auth_failed`}),googleCallback);
router.post("/forgetpassword",forgotPassword);
router.post("/verifyotp",verifyOTP)
export default router;