import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authroutes from "./routes/dbuser.auth.js"
import translatorroutes from './routes/texttospeech.user.js'
import aiRouter from "./routes/airoute.js";
import conversationRouter from './routes/conversationroute.js'
import uploadRouter from './routes/attachmentroute.js'
const app = express();
const allowedOrigins = [
  "https://text-to-speech-ai-generator-backend-xi.vercel.app/login",
  "https://text-to-speech-ai-generator-backend-eight.vercel.app",
  "https://text-to-speech-ai-generator-backend-3kb2-git-main-ruchi5.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
     
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.get("/api/health",(req,res)=>
{
    try{

    
    console.log("Health check done✅")
    res.status(200).json({success:true,message:"API is running"});
    }catch(error)
    {
        console.error("API is not runniing",error.message);
        return res.status(500).json({succes:false,message:error.message})
    }
});
app.use("/api/auth",authroutes);
app.use("/api/translate",translatorroutes);
app.use("/api/ai", aiRouter);
app.use("/api/user",conversationRouter);
app.use("/api/user",uploadRouter);
export default app;
