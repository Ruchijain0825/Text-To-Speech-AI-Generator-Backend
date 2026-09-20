import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { loginUser, signupUser } from "../apis/auth.api.jsx";
import { OnForgotPassword } from "./ForgotPassword.jsx";

const UserAuth = () => {
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSignup = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin.mutate({ email, password });
    } else {
      handleSignup.mutate({ name, email, password });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex h-110 w-100 flex-col items-center rounded-2xl bg-white shadow-xl">
        <h1 className="mt-0 text-2xl font-semibold text-gray-700">{isLogin ? "Welcome Back" : "Create an Account"}</h1>

        {isLogin ? (
          <div className="mt-10 flex flex-col justify-end">
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-80 rounded-xl border border-gray-300 bg-gray px-4 py-3 text-gray-300 shadow-l outline-none" placeholder="your@.com" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="mt-6 w-80 rounded-xl border border-gray-300 bg-gray px-4 py-3 text-gray-300 shadow-l outline-none" placeholder="Enter your password" />
          </div>
        ) : (
          <>
            <input type="name" onChange={(e) => setName(e.target.value)} value={name} className="w-80 rounded-xl border border-gray-300 bg-gray px-4 py-3 text-gray-300 shadow-l outline-none" placeholder="Your name" />
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="w-80 rounded-xl border border-gray-300 bg-gray px-4 py-3 text-gray-300 shadow-l outline-none" placeholder="your@.com" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="mt-6 w-80 rounded-xl border border-gray-300 bg-gray px-4 py-3 text-gray-300 shadow-l outline-none" placeholder="Enter your password" />
          </>
        )}

        {isLogin && (
          <div className="mt-6 flex w-full items-center justify-between px-14 pr-16">
            <div className="flex items-center gap-3">
              <input className="h-4 w-4" type="checkbox" />
              <label className="text-sm text-gray-600">Remember me</label>
            </div>
            <a onClick={(e) => { e.preventDefault(); setShowForgot(true); }} className="text-sm font-medium text-blue-600 hover:underline" href="#">forgot password</a>
            {showForgot && <OnForgotPassword onClose={() => setShowForgot(false)} />}
          </div>
        )}

        <button onClick={handleSubmit} type="button" className="mt-5 h-10 w-80 rounded-xl border border-gray-300 bg-gradient-to-r from-blue-400 to-indigo-500 px-4 py-2 text-white shadow-lg outline-none">{isLogin ? "Login" : "Register"}</button>

        <p>or</p>

        <button onClick={() => { window.location.href = "https://text-to-speech-ai-generator-backend.onrender.com/api/auth/google"; }} className="mt-5 flex h-10 w-80 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-white hover:bg-opacity-80 hover:text-gray-700 hover:backdrop-blur-md" type="button">
          <FcGoogle className="shrink-0 text-xl" /><span>Sign in with Google</span>
        </button>

        <div className="flex items-center justify-start gap-20">
          {isLogin ? (
            <><p>create a new account</p><a onClick={() => setIsLogin(false)} className="font-semibold text-blue-600" href="#">signup</a></>
          ) : (
            <><p>Already have an account</p><a onClick={() => setIsLogin(true)} className="font-semibold text-blue-600" href="#">Login</a></>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuth;