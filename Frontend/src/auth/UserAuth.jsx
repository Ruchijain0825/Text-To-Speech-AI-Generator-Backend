import { form } from "../assets/assests";
import {useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { loginUser,signupUser } from "../apis/auth.api";
import {useMutation} from "@tanstack/react-query"
import { Toaster, toast } from "react-hot-toast";

const UserAuth = ()=>
{
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleLogin = useMutation({
      mutationFn:loginUser,
      onSuccess:(data)=>
      {
        console.log("Login successful",data);
        toast.success(data.message)
        
      },
      onError:(data)=>
      {
        console.log("Login unsuccessful",error.message);
        toast.error(error.message)
      }
    })
   

     return(
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className=" flex flex-col items-center w-100 h-100 rounded-2xl bg-white shadow-xl">
          <div>
           <h1 className="mt-0 text-2xl font-semibold text-gray-700">
            Welcome Back
          </h1>
          </div>
          <div className ="mt-10 flex flex-col  justify-end">
              
              <input type = "email" onChange={(e)=>setEmail(e.target.value)} value ={email} className="w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l" placeholder = "your@.com" /> 
              <input type = "password" onChange = {(e)=>setPassword(e.target.value)} value ={password} className="mt-6 w-80 border border-gray-300  px-4 py-3 outline-none text-gray-300 rounded-xl bg-gray shadow-l"  placeholder = "Enter your password" /> 
          </div>
         <div className="mt-6 flex w-full items-center justify-between px-14 pr-16">
            <div className="flex items-center gap-3"> 
            <input className ="text-semibold w-4 h-4" type ="checkbox"></input> 
            <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</label>
             </div>
            <a className ="text-sm font-medium text-blue-600 hover:underline" href ="#">forgot password</a>
          </div>
            <div> 
          <button type ="button" className=" mt-5 w-80 h-10 border border-gray-300 px-4 py-2 outline-none text-white rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg" type ="button">Login</button>
          </div>
         
            <p>or</p>
             
           
              <button className="mt-5 w-80 h-10 border border-gray-300 px-4 py-2 outline-none text-white rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:bg-white hover:bg-opacity-80 hover:text-gray-700 hover:backdrop-blur-md transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
               type="button">

 
             <FcGoogle className="text-xl shrink-0" />
             <span>Sign in with Google</span>
            </button>
          </div>
          </div>
        
        </>
     )
}
export default UserAuth;