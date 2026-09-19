import { useState } from "react";
import toast from "react-hot-toast";
import { forgetPasswordApi } from "../apis/forget.api.jsx";
import OTPVerification from "./OtpSent.jsx";
import ResetPassword from "./ResetPassword.jsx";

export const OnForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const data = await forgetPasswordApi({ email: email.trim() });
      toast.success(data.message || "OTP sent successfully");
      setVerifyOtp(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!verifyOtp && !resetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-end">
              <button onClick={onClose} type="button" className="text-lg text-gray-500 hover:text-gray-800">X</button>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Forgot Password?</h2>
              <p className="mt-2 text-sm text-gray-500">Enter your registered email address and we'll send you a verification code to reset your password.</p>
            </div>

            <div className="mt-6 flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />
              <button onClick={handleSendOTP} disabled={loading} type="button" className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 py-3 font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Sending..." : "Send OTP"}</button>
            </div>
          </div>
        </div>
      )}

      {verifyOtp && !resetPassword && (
        <OTPVerification email={email} onClose={onClose} onVerified={(otpValue) => { setVerifiedOtp(otpValue); setVerifyOtp(false); setResetPassword(true); }} />
      )}

      {resetPassword && <ResetPassword email={email} otp={verifiedOtp} onClose={onClose} />}
    </>
  );
};

export default OnForgotPassword;