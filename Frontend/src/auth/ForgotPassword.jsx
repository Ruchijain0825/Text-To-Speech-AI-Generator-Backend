import { useState } from "react";
import { forgetPasswordApi } from "../apis/forget.api.jsx";
import OTPVerification from "./OtpSent.jsx";
export const OnForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const[verifyOtp,setVerifyOtp]=useState(false)

  const handleSendOTP = async () => {
    try {
      const data = await forgetPasswordApi({ email });

      console.log(data);
      setVerifyOtp(true)
    } catch (error) {
      console.log(error.message);
    }
  }
 
    return(
        <>
        {!verifyOtp && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">

                <div className="flex justify-end"><button onClick={onClose}  className="text-gray-500 hover:text-gray-800 text-lg">X</button>
                </div>
          <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Forgot Password?
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your registered email address and we'll send you a
            verification code to reset your password.
          </p>
        </div>
                <div className="mt-6 flex flex-col">

                    <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email Address</label>
                    <input value ={email} onChange={(e)=>setEmail(e.target.value)} type ="email" placeholder="you@example.com"  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"></input>
                    <button  onClick ={handleSendOTP} className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 py-3 font-semibold text-white shadow-lg hover:opacity-90">Send Otp</button>
                </div>
        
            </div>
        </div>
    )
}
{verifyOtp && (
    <OTPVerification email={email} onClose={onClose}/>

)}
</>
    )};
