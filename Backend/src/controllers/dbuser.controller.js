import { registerUser,loginUser,googleLoginUser, sendForgetPasswordOTP,verifyOtp } from "../services/dbuser.js";
import { forgetPassword as saveForgotPassword } from "../models/dbuser.js";
import bcrypt from "bcrypt"

export const signUp = async(req,res)=>
{
    try{
        const {name,email,password} = req.body;
        if(!name||!email||!password)
        {
            return res.status(400).json({success:false,message:"Fill the required fields"});
        }
        await registerUser({name,email,password})
        return res.status(201).json({success:true,message:"User created successfully"});

        

    }
    catch(error)
    {
        console.log("Signup error",error.message);
        if(error.message==="User is already exist")
            return res.status(409).json({success:false,message:"User already exist"});
        if(error.message==="Name is required"||
           error.message==="Name can not contains number"||
           error.message==="Email is required"||
           error.message==="Please enter a strong password"
          
        )
        return res.status(400).json({success:false,message:error.message})
          
    }
    return res.status(500).json({success:false,message:"Internal Server Error"})
}
export const login = async(req,res)=>
{
    try{
        const{email,password}=req.body;
        if(!email||!password)
        {
            return res.status(400).json({success:false,message:"email and password is required"})
        }
        const {user,accessToken,refreshToken}=await loginUser({email,password});
        res.cookie("refreshToken",refreshToken ,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict",
                maxAge:2*24*60*60*1000


            }
        )
        return res.status(200).json({success:true,message:"login successful"})
        
    }
    catch(error)
    {
        console.error("Login unsuccessful",error.message);
        if(error.message==="Email is not registered" ||
           error.message==="Invalid email or password"
        )
        return res.status(400).json({success:false,message:error.message})
    }
    return res.status(500).json({success:false,message:"Internla Server Error"})
}
export const googleCallback = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await googleLoginUser(req.user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}`
        );
    } catch (error) {
        console.error("Google callback error:", error.message);

        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
        );
    }
};
export const forgotPassword = async(req,res)=>
{
    try{
        const {email} = req.body;
        const otp = Math.floor(100000+Math.random()*900000).toString();
        const otpExpiry = new Date(Date.now()+10*60*1000);
       
        const otpHash = await bcrypt.hash(otp,5)

         const user=await saveForgotPassword({email,otp:otpHash,otpExpiry});
        if(!user)
        {
            return res.status(404).json({success:false,message:"Email is not registererd"})
        }

        
        await sendForgetPasswordOTP({email,otp});
        return res.status(200).json({success:true,message:"Otp sent successfully"})
    }
    catch(error)
    {
        console.error("forgot password error",error.message);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

export const verifyOTP = async(req,res)=>
{
    try{
        const{email,otp}=req.body;
        if(!email||!otp)
        {
            return res.status(400).send({success:false,message:"email and otp is required"})
        }
        await verifyOtp(email,otp)
        return res.status(201).send({success:true,message:"otp verified successfully"})
    }
    catch(error)
    {
        console.error("verification failed",error.message);
        return res.status(400).send({success:false,message:error.message})
    }
   
}
