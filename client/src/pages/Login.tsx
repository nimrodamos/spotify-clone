import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };
  const handleNavSignUp = () => {
    navigate("/signup");
  };
  const handleNavPassword = () => {
    navigate("/password-reset");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen text-white"
      style={{
        background:
          "linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)",
      }}
    >
      {" "}
      {/* Enlarged card background */}
      <div className="w-[160%] max-w-xl p-12 bg-[#121212] rounded-lg shadow-lg transform scale-125 flex justify-center">
        {/* Inner container with 60% width */}
        <div className="w-[60%] scale-[0.85]">
          {/* Centered Spotify Icon */}
          <div className="flex justify-center mb-4">
            <FaSpotify className="text-4xl text-green-500" />
          </div>

          {/* Form content */}
          <h1 className="text-2xl font-bold text-center mb-8">
            Log in to Spotify
          </h1>

          {/* Social Login Buttons */}
          <button className="w-[105%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
            <FcGoogle className="ml-6 size-6" />
            <span className="text-center w-full">Continue with Google</span>
          </button>
          <button className="w-[105%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
            <SiFacebook className="ml-6 size-6" color="#1877F2" />
            <span className="text-center w-full">Continue with Facebook</span>
          </button>
          <button className="w-[105%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
            <FaApple className="ml-6 size-6" />
            <span className="text-center w-full">Continue with Apple</span>
          </button>

          {/* Separator Line */}
          <div className="w-[175%] h-[3px] bg-[#1C1C1C] mx-auto my-8 shadow-lg font-bold -ml-[40%] -mr-[25%]"></div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email or username
            </label>
            <input
              type="email"
              className="w-[105%] px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
              placeholder="Email or username"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-[105%] px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-[0.65rem] text-gray-500 hover:text-gray-300"
              >
                👁️
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-[105%] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90">
            Log In
          </button>

          {/* Links */}
          <div className="text-center mt-6">
            <a
              href="#"
              className="text-sm text-[#E4E4E4] hover:text-green-500"
              onClick={handleNavPassword}
            >
              Forgot your password?
            </a>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-400">
              Don't have an account?
            </span>{" "}
            <a
              className="text-sm text-[#E4E4E4] hover:text-green-500 cursor-pointer"
              onClick={handleNavSignUp} // Pass the function reference here
            >
              Sign up for Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
