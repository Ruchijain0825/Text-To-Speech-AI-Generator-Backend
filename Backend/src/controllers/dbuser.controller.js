import { registerUser,loginUser } from "../services/dbuser.js";

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