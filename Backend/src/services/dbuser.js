import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser,findUserByEmail,findUserById } from "../models/dbuser.js";
import nodemailer from "nodemailer"

export const registerUser = async({email,name,password})=>
{
    

        
        if(!name || !name.trim())
        {
            throw new Error("Name is required")
        }
        if(/\d/.test(name))
        {
            throw new Error("Name can not contains number")
        }
        if(!email || !email.trim())
        {
            throw new Error("Email is required")
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {

        throw new Error("Please enter a valid email address");

        }

        if(!password || password.length<8)
        {
            throw new Error("Please enter a strong password")
        }
        const existingUser = await findUserByEmail(email.trim())
        if(existingUser)
        {
            throw new Error("User is already exist")
        }
        const passwordHash = await bcrypt.hash(password,10);
        const user = await createUser({email:email.trim(),name:name.trim(),passwordHash})
        return{
            user:
            {   id:user.id,
                email:user.email,
                name:user.name,
                imageUrl:user.image_url,
               
            }
        }

    
   
}
export const loginUser = async({email,password})=>
{
    const user = await findUserByEmail(email)
   

    if(!user)
    {
        throw new Error("Email is not registered")
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password_hash);
    if(!isPasswordMatch)
    {
        throw new Error("Invalid email or password");

    }

    const accessToken =  jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'15m'});

    const refreshToken = jwt.sign({userId:user.id},process.env.JWT_REFRESH_TOKEN,{expiresIn:"2d"})

    return {
    
        user:
        {
            id:user.id,
            email:user.email,
            name:user.name,
            image_url:user.image_url
        },

        accessToken,
        refreshToken
    }

}
     export const getUserById = async(userId)=>
    {
    return findUserById(userId);
    }
    export const googleLoginUser = async (user) => {
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "2d" }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image_url: user.image_url,
        },
        accessToken,
        refreshToken,
    };
};
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:
    {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
export const sendForgetPasswordOTP = async({email,otp})=>
{
    try{
        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Password Reset OTP",
            html:
            `<h2>Reset your Password</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This otp will expire soon`
            
        });
        console.log("OTP email sent successfully")
    }
    catch(error)
    {
        console.log("Email sending error",error.message);
       throw error;
    }
   
}
export const verifyOtp = async(email,otp)=>
{
    const user = await findUserByEmail(email);
    if(!user)
    {
        throw new Error("email is not registered")
    }
    if(!user.otp)
    {
        throw new Error ("Otp not found")
    }
    if(new Date()>new Date(user.otp_expiry))
    {
        throw new Error("Otp is expired")
    }
    const isOtpVerified = await bcrypt.compare(otp,user.otp);
    if(!isOtpVerified)
    {
        throw new Error('Invalid otp')
    }
    return user
}