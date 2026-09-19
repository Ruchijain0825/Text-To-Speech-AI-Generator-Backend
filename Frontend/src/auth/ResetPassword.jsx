import { useState } from "react";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../apis/forget.api";

const ResetPassword = ({ email, otp, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPasswordApi({ email, otp, password });
      console.log("RESET PASSWORD RESPONSE:", data);
      toast.success(data.message || "Password reset successfully");
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error.message);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-2xl bg-white p-7 shadow-xl">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="text-lg text-gray-500 hover:text-gray-800">X</button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">Enter your new password below.</p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">{showPassword ? "Hide" : "Show"}</button>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">{showConfirmPassword ? "Hide" : "Show"}</button>
          </div>
        </div>

        <button type="button" onClick={handleResetPassword} disabled={loading} className="mt-7 w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 py-3 font-semibold text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Resetting..." : "Reset Password"}</button>
      </div>
    </div>
  );
};

export default ResetPassword;