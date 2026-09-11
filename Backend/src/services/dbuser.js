import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser,findUserByEmail,findUserById } from "../models/dbuser.js";

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