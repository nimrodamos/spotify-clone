import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { useUserContext } from "../Context/UserContext"; // Import UserContext
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserContext(); // Access UserContext

  const handleLogin = async () => {
    try {
      const response = await fetch("https://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log in");
      }

      const userData = await response.json();
      console.log("Logged in successfully:", userData);

      // Store the logged-in user in UserContext
      setUser(userData);

      console.log("Access Token:", userData.accessToken);

      // Redirect to the main page or dashboard
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging in:", error.message);
      } else {
        console.error("Error logging in:", error);
      }
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleNavSignUp = () => {
    navigate("/signup");
  };

  const handleNavPassword = () => {
    navigate("/password-reset");
  };

  return (
    <div
      className="flex flex-col min-h-screen text-white"
      style={{
        background:
          "linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)",
      }}
    >
      <div className="flex-grow flex items-center justify-center">
        <div
          className="w-[735px] h-[805px] bg-[#121212] rounded-xl shadow-lg transform flex justify-center mt-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        >
          <div className="w-[325px] mt-9">
            <div className="flex justify-center mb-4">
              <FaSpotify className="text-[41px] text-[#FFFFFF]" />
            </div>

            <h1 className="text-2xl font-bold text-center mb-8">
              Log in to Spotify
            </h1>

            <button className="w-[100%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
              <FcGoogle className="ml-6 size-6" />
              <span className="text-center w-full">Continue with Google</span>
            </button>
            <button className="w-[100%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
              <SiFacebook className="ml-6 size-6" color="#1877F2" />
              <span className="text-center w-full">Continue with Facebook</span>
            </button>
            <button className="w-[100%] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
              <FaApple className="ml-6 size-6" />
              <span className="text-center w-full">Continue with Apple</span>
            </button>

            <div className="w-[175%] h-[3px] bg-[#1C1C1C] mx-auto my-8 shadow-lg font-bold -ml-[40%] -mr-[25%]"></div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email or username
              </label>
              <input
                type="email"
                className="w-[100%] px-3 py-[0.76rem] bg-transparent rounded border border-white/50 text-white focus:ring-2 focus:ring-[#FFFFFF] outline-none hover:border-white"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-[100%] px-3 py-[0.76rem] bg-transparent rounded border border-white/50 text-white focus:ring-2 focus:ring-[#FFFFFF] outline-none hover:border-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-[10px] text-3xl text-[#B3B3B3] hover:text-[#FFFFFF]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
              </div>
            </div>

            <button
              className="w-[100%] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90"
              onClick={handleLogin}
            >
              Log In
            </button>

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
                onClick={handleNavSignUp}
              >
                Sign up for Spotify
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="w-full h-[80px] bg-[#121212] text-[#FFFFFF] flex items-center justify-center mt-9">
        <p className="text-sm text-center">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
