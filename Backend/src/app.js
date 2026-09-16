import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authroutes from "./routes/dbuser.auth.js"
import translatorroutes from './routes/texttospeech.user.js'
import aiRouter from "./routes/airoute.js";
import conversationRouter from './routes/conversationroute.js'
const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
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
app.use("/api/user",conversationRouter)
export default app;
