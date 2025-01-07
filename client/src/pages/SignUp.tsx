import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//! icons import
import { FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailValidation = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/validate-email?email=${encodeURIComponent(
          email
        )}`
      );
      const data = await response.json();

      if (response.ok && !data.valid) {
        setError("This email is already registered. Please log in.");
      } else {
        setError("");
        setStep(2);
      }
    } catch {
      setError("An error occurred. Please try again later.");
    }
  };

  const handlePasswordValidation = () => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{10,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one letter, one number or special character, and be at least 10 characters long."
      );
      return;
    }
    setError("");
    setStep(3);
  };

  const handleProfileValidation = () => {
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
      setError("Please select a valid date of birth.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    setError("");
    setStep(4);
  };

  const handleAccountCreation = async () => {
    const dateOfBirth = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: name,
          email,
          password,
          gender,
          dateOfBirth,
        }),
      });

      if (response.ok) {
        // Account creation successful
        navigate("/dashboard"); // Redirect to dashboard or home
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create an account.");
      }
    } catch {
      setError("An error occurred during account creation. Please try again.");
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#121212] text-white relative">
      <FaSpotify className="text-5xl text-green-500 mt-6 mb-6" />

      {step === 1 && (
          <>
                  <h1 className="text-5xl font-bold text-center mb-12">
                    Sign up to <br /> start listening
                  </h1>
        
                  <div className="mb-4 w-[300px]">
                    <label className="block text-sm font-medium mb-2">Email address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
        
                  <button
                    className="w-[300px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90 mb-10"
                    onClick={handleEmailValidation}
                  >
                    Next
                  </button>
        
                  <div className="relative flex items-center justify-center mb-10">
                    <div className="w-[300px] h-[1px] bg-[#7C7C7C]"></div>
                    <span className="absolute bg-[#121212] px-4 text-sm text-gray-400">
                      or
                    </span>
                  </div>
        
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
                </>
      )}

{step === 2 && (
  <>
    {/* Progress Bar */}
    <div className="w-[440px] h-[2px] bg-gray-600 rounded-full overflow-hidden mb-4">
      <div className="h-full bg-green-500" style={{ width: "33%" }}></div>
    </div>

    {/* Step Indicator and Back Button */}
    <div className="flex items-center justify-start w-[440px] mb-3">
      <IoChevronBack
        className="text-gray-400 cursor-pointer hover:text-white size-7"
        onClick={() => setStep(1)}
      />
      <div className="flex flex-col gap-1 ml-4">
        <p className="text-sm text-[#B3B3B3]">Step 1 of 3</p>
        <p className="text-sm text-[#FFFFFF] font-bold">Create a password</p>
      </div>
    </div>

    {/* Password Input */}
    <div className="mt-6 mb-4 w-[325px]">
      <label className="block text-sm font-medium mb-2">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full px-3 py-[0.76rem] bg-transparent rounded-md border ${
            error ? "border-[#ED2C3F]" : "border-white/50"
          } text-white outline-none hover:border-white`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-[0.65rem] text-gray-500 hover:text-gray-300"
          onClick={() => setShowPassword(!showPassword)}
        >
          👁️
        </button>
      </div>
      {error && <p className="text-[#ED2C3F] text-sm mt-2">{error}</p>}
    </div>

    {/* Password Criteria Section */}
    <div className="w-[325px]">
      <p className="text-sm text-[#FFFFFF] mb-2 font-bold">Password must contain:</p>
      <ul className="text-gray-400 text-sm mb-6">
        <li
          className={
            /.*[a-zA-Z].*/.test(password) ? "text-[#FFFFFF]" : "text-[#F3727F]"
          }
        >
          ✔ At least one letter
        </li>
        <li
          className={
            /.*[0-9!@#$%^&*].*/.test(password)
              ? "text-[#FFFFFF]"
              : "text-[#F3727F]"
          }
        >
          ✔ At least one number or special character
        </li>
        <li
          className={
            password.length >= 10 ? "text-[#FFFFFF]" : "text-[#F3727F]"
          }
        >
          ✔ At least 10 characters
        </li>
      </ul>
    </div>

    {/* Next Button */}
    <button
      className="w-[325px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90"
      onClick={handlePasswordValidation}
    >
      Next
    </button>
  </>
)}





{step === 3 && (
  <>
{/* Progress Bar */}
<div className="w-[440px] h-[2px] bg-gray-600 rounded-full overflow-hidden mb-4 relative">
  <div className="h-full bg-green-500" style={{ width: "66%" }}></div>
</div>

{/* Step Indicator and Back Button */}
<div className="flex items-center w-[440px] mb-6">
  {/* Back Button */}
  <IoChevronBack
    className="text-gray-400 cursor-pointer hover:text-white size-7"
    onClick={() => setStep(2)}
    style={{ marginLeft: "5px", }} // Positioned 21px from progress bar edge
  />

  {/* Step Text */}
  <div className="flex flex-col gap-1" style={{ marginLeft: "21px" }}> {/* Align text with the form */}
    <p className="text-sm text-[#B3B3B3]">Step 2 of 3</p>
    <p className="text-sm text-[#FFFFFF] font-bold">Tell us about yourself</p>
  </div>
</div>

    {/* Name Input */}
    <div className="mb-4 w-[325px]">
      <label className="block text-sm font-medium ">Your Name</label>
      <p className="text-[#B3B3B3] mb-1">This name will appear on your profile </p>
      <input
        type="text"
        className={`w-full px-3 py-[0.76rem] bg-transparent rounded-md border ${
          error ? "border-[#ED2C3F]" : "border-white/50"
        } text-white outline-none hover:border-white`}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && <p className="text-[#ED2C3F] text-sm mt-2">{error}</p>}
    </div>

    {/* Date of Birth Input */}
    <div className="mb-4 w-[325px]">
      <label className="block text-sm font-medium ">Date of Birth</label>
      <p className="text-[#B3B3B3] mb-2 text-sm">Why do we need your date of birth? <a href="">Learn more.</a></p>
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={4}
          className="w-1/3 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
          placeholder="yyyy"
          value={birthYear}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Allow only digits
            if (value.length <= 4) setBirthYear(value);
          }}
        />
        <select
          className="w-1/3 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
          onChange={(e) => setBirthMonth(e.target.value)}
          value={birthMonth}
        >
          <option value="">Month</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <input
          type="text"
          maxLength={2}
          className="w-1/3 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
          placeholder="dd"
          value={birthDay}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Allow only digits
            setBirthDay(value);
          }}
        />
      </div>
    </div>

    {/* Gender Selection */}
    <div className="mb-6 w-[325px]">
      <label className="block text-sm font-medium ">Gender</label>
      <p className="text-[#B3B3B3] mb-2 text-sm">We use your gender to help personalize our content recommendations and ads for you.</p>
      <div className="flex flex-wrap gap-4">
        {['Man', 'Woman', 'Non-binary', 'Undefined', 'Something-Else', 'Prefer-Not-To-Say'].map((option) => (
          <label key={option} className="flex items-center gap-2 text-gray-400">
            <input
              type="radio"
              name="gender"
              value={option}
              className="w-4 h-4"
              onChange={(e) => setGender(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>

    {/* Next Button */}
    <button
      className="w-[325px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90"
      onClick={handleProfileValidation}
    >
      Next
    </button>
  </>
)}



      {step === 4 && (
        <>
        {/* Progress Bar */}
<div className="w-[440px] h-[2px] bg-gray-600 rounded-full overflow-hidden mb-4 relative">
  <div className="h-full bg-green-500" style={{ width: "100" }}></div>
</div>

{/* Step Indicator and Back Button */}
<div className="flex items-center w-[440px] mb-6">
  {/* Back Button */}
  <IoChevronBack
    className="text-gray-400 cursor-pointer hover:text-white size-7"
    onClick={() => setStep(3)}
    style={{ marginLeft: "5px", }} // Positioned 21px from progress bar edge
  />

  {/* Step Text */}
  <div className="flex flex-col gap-1" style={{ marginLeft: "21px" }}> {/* Align text with the form */}
    <p className="text-sm text-[#B3B3B3]">Step 3 of 3</p>
    <p className="text-sm text-[#FFFFFF] font-bold">Terms and Conditions</p>
  </div>
</div>

          <div className="w-[300px] mb-4">
            <label className="flex items-center gap-2 text-gray-400 mb-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>I want to receive news and offers from Spotify.</span>
            </label>
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="w-4 h-4" />
              <span>Share my registration data for marketing purposes.</span>
            </label>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            By clicking on register, you agree to Spotify's{" "}
            <a href="#" className="text-green-500 hover:underline">
              Terms and Conditions of Use
            </a>
            .
            <br />
            To learn more about how Spotify collects, uses, shares, and protects your personal data, please see{" "}
            <a href="#" className="text-green-500 hover:underline">
              Spotify's Privacy Policy
            </a>
            .
          </p>

          <button
            className="w-[300px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90"
            onClick={handleAccountCreation}
          >
            Register
          </button>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </>
      )}

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
