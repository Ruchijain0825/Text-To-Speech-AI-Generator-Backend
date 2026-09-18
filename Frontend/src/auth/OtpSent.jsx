import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  verifyOtpApi,
  resendOtpApi
} from "../apis/forget.api";

export const OTPVerification = ({
  onClose,
  email,
  onVerified
}) => {

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);


  useEffect(() => {

    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {

      setCountdown((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [countdown]);


 
  const handleChange = (value, index) => {

    
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);


    if (value && index < 5) {

      inputRefs.current[index + 1]?.focus();

    }
  };


 
  
  const handleKeyDown = (event, index) => {

    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      inputRefs.current[index - 1]?.focus();

    }
  };



  const handleVerifyOtp = async () => {

    const otpValue = otp.join("");

    // Check 6 digit
    if (otpValue.length !== 6) {

      toast.error("Enter a valid 6 digit OTP");

      return;
    }

    try {

      setLoading(true);

      const data = await verifyOtpApi({
        email: email,
        otp: otpValue
      });

      console.log(
        "VERIFY OTP RESPONSE:",
        data
      );

      // SUCCESS TOAST
      toast.success(
        data?.message ||
        "OTP verified successfully"
      );

    
      */
      setTimeout(() => {

        if (onVerified) {
          onVerified();
          onVerified(otpValue);
        } else {
          onClose();
        }

      }, 1000);

    } catch (error) {

      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      toast.error(
        error.message ||
        "Invalid or expired OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleResendOtp = async () => {

    // Don't allow multiple clicks
    if (countdown > 0 || resendLoading) {
      return;
    }

    try {

      setResendLoading(true);

      const data = await resendOtpApi({
        email: email
      });

      console.log(
        "RESEND OTP RESPONSE:",
        data
      );

      // SUCCESS TOAST
      toast.success(
        data?.message ||
        "OTP resent successfully"
      );

      // Clear old OTP
      setOtp([
        "",
        "",
        "",
        "",
        "",
        ""
      ]);

      // Start countdown
      setCountdown(30);

      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (error) {

      console.error(
        "RESEND OTP ERROR:",
        error
      );

      toast.error(
        error.message ||
        "Failed to resend OTP"
      );

    } finally {

      setResendLoading(false);

    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[420px] rounded-2xl bg-white p-7 shadow-xl">

        {/* -------------------------------- */}
        {/* CLOSE */}
        {/* -------------------------------- */}

        <div className="flex justify-end">

          <button
            onClick={onClose}
            type="button"
            className="text-lg text-gray-500 hover:text-gray-800"
          >
            X
          </button>

        </div>


        {/* -------------------------------- */}
        {/* HEADING */}
        {/* -------------------------------- */}

        <div className="text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            Enter OTP
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit OTP sent to your email address.
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {email}
          </p>

        </div>


        {/* -------------------------------- */}
        {/* OTP INPUTS */}
        {/* -------------------------------- */}

        <div className="mt-7 flex justify-center gap-3">

          {otp.map((value, index) => (

            <input
              key={index}

              ref={(element) => {
                inputRefs.current[index] = element;
              }}

              value={value}

              maxLength={1}

              inputMode="numeric"

              onChange={(e) =>
                handleChange(
                  e.target.value,
                  index
                )
              }

              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  index
                )
              }

              className="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl outline-none focus:border-blue-500"
            />

          ))}

        </div>

}

        <button
          onClick={handleVerifyOtp}

          disabled={loading}

          type="button"

          className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 py-3 font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading
            ? "Verifying..."
            : "Verify OTP"
          }

        </button>


   

        <p className="mt-5 text-center text-sm text-gray-500">

          Didn't receive the code?

          <button
            type="button"

            onClick={handleResendOtp}

            disabled={
              countdown > 0 ||
              resendLoading
            }

            className={`ml-1 font-semibold ${
              countdown > 0 ||
              resendLoading
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer text-blue-600 hover:text-blue-700"
            }`}
          >

            {resendLoading
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend OTP"
            }

          </button>

        </p>

      </div>

    </div>
  );
};

export default OTPVerification;