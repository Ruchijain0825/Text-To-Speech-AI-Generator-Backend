
import { useState } from "react";
import toast from "react-hot-toast";
import { verifyOtpApi } from "../apis/forget.api";

export const OTPVerification = ({ onClose,email }) => {

    const[otp,setOtp]=useState(["","","","","",""]);
    const handleChange = (value,index)=>
    {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index]=value;
        setOtp(newOtp)
    }
    const handleVerifyOtp = async()=>
    {
        try{
            const otpValue = otp.join("");
            if(otpValue.length!==6)
            {
                console.log("please enter a 6 digit otp ")
                 toast.error("Enter a valid 6 digit OTP");
                 return
            }
              const data = await verifyOtpApi({
                email,
                otp: otpValue
            });

            console.log(data);
            toast.success(data.message)
        }
        catch (error) {
            console.log(error.message);
        }
    };
       
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-2xl bg-white p-7 shadow-xl">

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            X
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Enter OTP
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit OTP sent to your email address.
          </p>
        </div>

        <div className="mt-7 flex justify-center gap-3">
          {otp.map((value,index)=>(
             <input key ={index} value={value} maxLength="1"  onChange={(e) => handleChange(e.target.value, index)}  className="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl outline-none focus:border-blue-500"/>

                           
       
                        

          ))}
        </div>

        <button onClick = {handleVerifyOtp} className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 py-3 font-semibold text-white shadow-lg hover:opacity-90">
          Verify OTP
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Didn't receive the code?
          <span className="ml-1 cursor-pointer font-semibold text-blue-600">
            Resend OTP
          </span>
        </p>

      </div>
    </div>
  );
};

export default OTPVerification;
