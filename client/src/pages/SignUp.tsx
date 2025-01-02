import React, { useState } from "react";
import { FaApple, FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log("Email:", email);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#121212] text-white relative">
      {/* Spotify Icon */}
      <FaSpotify className="text-5xl text-green-500 mt-6 mb-6" />

      {/* Header */}
      <h1 className="text-5xl font-bold text-center mb-12">
        Sign up to <br />
        start listening
      </h1>

      {/* Email Input */}
      <div className="mb-4 w-[300px]">
        <label className="block text-sm font-medium mb-2">Email address</label>
        <input
          type="email"
          className="w-full px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Next Button */}
      <button
        className="w-[300px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90 mb-10"
        onClick={handleSignUp}
      >
        Next
      </button>

      {/* Separator Line with "or" */}
      <div className="relative flex items-center justify-center mb-10">
        <div className="w-[300px] h-[1px] bg-[#7C7C7C]"></div>
        <span className="absolute bg-[#121212] px-4 text-sm text-gray-400">
          or
        </span>
      </div>

      {/* Social Login Buttons */}
      <button className="w-[300px] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
        <FcGoogle className="ml-6 size-6" />
        <span className="text-center w-full">Sign up with Google</span>
      </button>
      <button className="w-[300px] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
        <SiFacebook className="ml-6 size-6" color="#1877F2" />
        <span className="text-center w-full">Sign up with Facebook</span>
      </button>
      <button className="w-[300px] py-[0.73rem] mb-6 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
        <FaApple className="ml-6 size-6" />
        <span className="text-center w-full">Sign up with Apple</span>
      </button>

      {/* Footer Links */}
      <div className="text-center mt-6">
        <span className="text-sm text-gray-400">Already have an account?</span>{" "}
        <a
          href="#"
          className="text-sm text-[#E4E4E4] hover:text-green-500 underline"
          onClick={() => navigate("/login", { replace: true })}
        >
          Log in here.
        </a>
      </div>

      {/* Legal Text Sticking to Bottom */}
      <div className="absolute bottom-4 text-center text-xs text-gray-400 max-w-[80%]">
        This site is protected by reCAPTCHA and the Google <br />
        <a href="#" className="text-[#E4E4E4] hover:text-green-500">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#E4E4E4] hover:text-green-500">
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </div>
  );
};

export default SignUpPage;
