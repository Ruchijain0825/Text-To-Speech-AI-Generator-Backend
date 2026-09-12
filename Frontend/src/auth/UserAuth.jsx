import { form } from "../assets/assests";
import {useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { loginUser,signupUser } from "../apis/auth.api.jsx";

import {useMutation} from "@tanstack/react-query"
import { Toaster, toast } from "react-hot-toast";
import { OnForgotPassword } from "./ForgotPassword.jsx";
import {OTPVerification} from './OtpSent.jsx'

const UserAuth = ()=>

{   const [showForgot, setShowForgot] = useState(false);
    const [verifyOtp,setVerifyOtp] = useState(false)
    const[isLogin,setIsLogin]=useState(true)
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
  

    const handleLogin = useMutation({
      mutationFn:loginUser,
      onSuccess:(data)=>
      {
        console.log("Login successful",data);
        toast.success(data.message);
        setEmail("");
        setPassword("")
        
      },
      onError:(error)=>
      {
        console.log("Login unsuccessful",error.message);
        toast.error(error.message)
      }
    })
    const handleSignup = useMutation({
      mutationFn:signupUser,
      onSuccess:(data)=>
      {
        console.log("Registration successful",data);
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        
      },
      onError:(error)=>
      {
        console.log("Registration unsuccessful",error.message);
        toast.error(error.message)
      }
    })
   

     return(
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className=" flex flex-col items-center w-100 h-110 rounded-2xl bg-white shadow-xl">
          <div>

           <h1 className="mt-0 text-2xl font-semibold text-gray-700">
            {isLogin ? "Welcome Back":"Create an Account"}
          </h1>
          </div>
          {isLogin ? (<>  <div className ="mt-10 flex flex-col  justify-end">
              
              <input type = "email" onChange={(e)=>setEmail(e.target.value)} value ={email} className="w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l" placeholder = "your@.com" /> 
              <input type = "password" onChange = {(e)=>setPassword(e.target.value)} value ={password} className="mt-6 w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l"  placeholder = "Enter your password" /> 
          </div> </>):(<>
            
             <input type = "name" onChange={(e)=>setName(e.target.value)} value ={name} className="w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l" placeholder = "your@.com" /> 

            <input type = "email" onChange={(e)=>setEmail(e.target.value)} value ={email} className="w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l" placeholder = "your@.com" /> 

              <input type = "password" onChange = {(e)=>setPassword(e.target.value)} value ={password} className="mt-6 w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l"  placeholder = "Enter your password" /> 
          
          
          </>)}
          
        {isLogin && (
  <div className="mt-6 flex w-full items-center justify-between px-14 pr-16">
    <div className="flex items-center gap-3">
      <input
        className="text-semibold w-4 h-4"
        type="checkbox"
      />

      <label className="text-sm text-gray-600">
        Remember me
      </label>
    </div>

    <a onClick = {(e)=>{e.preventDefault();setShowForgot(true)}}
      className="text-sm font-medium text-blue-600 hover:underline"
      href="#"
    >
      forgot password
    </a>
    {showForgot && (<OnForgotPassword onClose = {()=>setShowForgot(false)}/>)}
  </div>
)}

<div>
  <button onClick = {()=>{if(isLogin) 
    {
      handleLogin.mutate({
        email:email,
        password:password
      })
    }
    else{
      handleSignup.mutate({
        name:name,
        email:email,
        password:password
      })
    }
  }}
    type="button"
    className="mt-5 w-80 h-10 border border-gray-300 px-4 py-2 outline-none text-white rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg"
  >
    {isLogin ? "Login" : "Register"}
  </button>
</div>

<p>or</p>

<button onClick={()=>{window.location.href= "https://cloud-media-storage-backend.onrender.com/api/auth/google"}}
  className="mt-5 w-80 h-10 border border-gray-300 px-4 py-2 outline-none text-white rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:bg-white hover:bg-opacity-80 hover:text-gray-700 hover:backdrop-blur-md transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
  type="button"
>
  <FcGoogle className="text-xl shrink-0" />
  <span>Sign in with Google</span>
</button>
            
            
         
            <div className="flex flex items-center justify-start gap-20"> 
             {isLogin ? (<> 
             <p>craete a new account</p><span><a onClick={()=>setIsLogin(false)} className="text-blue-600 font-semibold " href = "#">signup</a></span> </>):(<>
             
             
             <p>Already have an account</p><span><a onClick ={()=>setIsLogin(true)} className="text-blue-600 font-semibold " href = "#">Login</a></span> </>)}
           
           
            </div>
          </div>
          </div>
        
        </>
     )
}
export default UserAuth;