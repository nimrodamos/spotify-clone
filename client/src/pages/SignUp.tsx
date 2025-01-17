import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//! icons import

import { FaSpotify } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { IoIosCheckmark } from "react-icons/io";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";

const SignUpPage: React.FC = () => {

  //? states ? !??@?

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
  const [isTouched, setIsTouched] = useState(false); // Tracks if the input has been interacted with
  const [isErrorTriggered, setIsErrorTriggered] = useState(false); // Tracks if "Next" was pressed with an invalid passwor
  const isPasswordValid =
  /.*[a-zA-Z].*/.test(password) &&
  /.*[0-9!@#$%^&*].*/.test(password) &&
  password.length >= 10;
  const navigate = useNavigate();

  //!functions

  const handleEmailValidation = async () => {
    try {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating "something@something.something"
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
  
      // Proceed with server validation
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
  
  // Validates the password and navigates to the next step
  const handlePasswordValidation = () => {
    if (!isPasswordValid) {
      setIsTouched(true); // Ensure conditions and border are shown
      setIsErrorTriggered(true); // Trigger red border
      setError("Password must meet the conditions.");
      return;
    }
    setError(""); // Clear any existing error
    setStep(3); // Navigate to Step 3
  };

  // Marks the input as touched when it loses focus
  const handleInputBlur = () => {
    setIsTouched(true);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsTouched(false); // Reset touch state while typing
    setIsErrorTriggered(false); // Reset error triggered by "Next"
    setError(""); // Clear general error
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
    const dateOfBirth = `${birthYear}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDay.padStart(2, "0")}`;

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

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
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
      <FaSpotify className="text-[41px] text-[#FFFFFF] mt-6 mb-6" />

      {step === 1 && (
  <>
    <h1 className="text-5xl font-bold text-center mb-12">
      Sign up to <br /> start listening
    </h1>

    <div className="mb-4 w-[325px]">
      <label className="block text-sm font-medium mb-2">Email address</label>
      <input
        type="email"
        className="w-[100%] px-3 py-[0.76rem] bg-transparent rounded border border-white/50 text-white focus:ring-2 focus:ring-[#FFFFFF] outline-none hover:border-white"
        placeholder="name@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>

    <button
      className="w-[325px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90 mb-10"
      onClick={handleEmailValidation}
    >
      Next
    </button>

    <div className="relative flex items-center justify-center mb-10">
      <div className="w-[325px] h-[1px] bg-[#7C7C7C]"></div>
      <span className="absolute bg-[#121212] px-4 text-sm text-[#FFFFFF]">or</span>
    </div>

    <button className="w-[325px] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
      <FcGoogle className="ml-6 size-6" />
      <span className="text-center w-full">Sign up with Google</span>
    </button>
    <button className="w-[325px] py-[0.73rem] mb-2 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
      <SiFacebook className="ml-6 size-6" color="#1877F2" />
      <span className="text-center w-full">Sign up with Facebook</span>
    </button>
    <button className="w-[325px] py-[0.73rem] mb-6 bg-transparent text-[#E4E4E4] font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 border border-white/50 hover:border-white">
      <FaApple className="ml-6 size-6" />
      <span className="text-center w-full">Sign up with Apple</span>
    </button>

    {/*Section for Blurred Line and Navigation */}
    <div className="relative flex items-center justify-center mt-2 mb-8">
      <div className="w-[325px] h-[1px] bg-[#292929]"></div>
    </div>
    <p className="text-sm text-gray-400">
      Already have an account?{" "}
      <a
        href="/login"
        className="text-white underline hover:text-green-500"
      >
        Log in here
      </a>
    </p>
  </>
)}

{step === 2 && (
  <>
    {/* Progress Bar */}
    <div className="w-[440px] h-[2px] bg-gray-600 rounded-full overflow-hidden mb-4">
      <div className="h-full bg-green-500" style={{ width: "33%" }}></div>
    </div>

    {/* Step Indicator and Back Button */}
    <div className="flex items-center justify-start w-[440px] mb-4">
      <IoChevronBack
        className="text-gray-400 cursor-pointer hover:text-white size-7"
        onClick={() => {
          setStep(1)
          setError("")
        }}
      />
      <div className="flex flex-col gap-1 ml-6">
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
          className={`w-full px-3 py-[0.76rem] bg-transparent rounded border ${
            (!isPasswordValid && isTouched) || isErrorTriggered
              ? "border-[#ED2C3F]"
              : "border-white/50"
          } text-white outline-none hover:border-white`}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={handleInputBlur}
        />
        <button
          type="button"
          className="absolute right-4 top-[10px] text-3xl text-[#B3B3B3] hover:text-[#FFFFFF]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </button>
      </div>
      {error && <p className="text-[#ED2C3F] text-sm mt-2">{error}</p>}
    </div>

    {/* Password Conditions */}
    <div className="w-[325px]">
      <p className="text-sm text-white mb-2">Password must contain:</p>
      <ul className="text-sm mb-6 flex flex-col gap-2">
        <li className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full border flex items-center justify-center ${
              /.*[a-zA-Z].*/.test(password)
                ? "bg-[#1ED760] border-[#1ED760]"
                : !isTouched
                ? "border-[#7C7C7C]"
                : "border-[#F3727F]"
            }`}
          >
            {/.*[a-zA-Z].*/.test(password) && (
              <IoIosCheckmark className="text-black w-3 h-3" />
            )}
          </div>
          <span
            className={
              /.*[a-zA-Z].*/.test(password) || !isTouched
                ? "text-[#FFFFFF]"
                : "text-[#F3727F]"
            }
          >
            At least one letter
          </span>
        </li>
        <li className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full border flex items-center justify-center ${
              /.*[0-9!@#$%^&*].*/.test(password)
                ? "bg-[#1ED760] border-[#1ED760]"
                : !isTouched
                ? "border-[#7C7C7C]"
                : "border-[#F3727F]"
            }`}
          >
            {/.*[0-9!@#$%^&*].*/.test(password) && (
              <IoIosCheckmark className="text-black w-3 h-3" />
            )}
          </div>
          <span
            className={
              /.*[0-9!@#$%^&*].*/.test(password) || !isTouched
                ? "text-[#FFFFFF]"
                : "text-[#F3727F]"
            }
          >
            At least one number or special character
          </span>
        </li>
        <li className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full border flex items-center justify-center ${
              password.length >= 10
                ? "bg-[#1ED760] border-[#1ED760]"
                : !isTouched
                ? "border-[#7C7C7C]"
                : "border-[#F3727F]"
            }`}
          >
            {password.length >= 10 && (
              <IoIosCheckmark className="text-black w-3 h-3 " />
            )}
          </div>
          <span
            className={
              password.length >= 10 || !isTouched
                ? "text-[#FFFFFF]"
                : "text-[#F3727F]"
            }
          >
            At least 10 characters
          </span>
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
              style={{ marginLeft: "5px" }} // Positioned 21px from progress bar edge
            />

            {/* Step Text */}
            <div className="flex flex-col gap-1" style={{ marginLeft: "21px" }}>
              {" "}
              {/* Align text with the form */}
              <p className="text-sm text-[#B3B3B3]">Step 2 of 3</p>
              <p className="text-sm text-[#FFFFFF] font-bold">
                Tell us about yourself
              </p>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-4 w-[325px]">
            <label className="block text-sm font-medium ">Your Name</label>
            <p className="text-[#B3B3B3] mb-1">
              This name will appear on your profile{" "}
            </p>
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
            <p className="text-[#B3B3B3] mb-2 text-sm">
              Why do we need your date of birth? <a href="">Learn more.</a>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                className="w-1/4 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
                placeholder="yyyy"
                value={birthYear}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Allow only digits
                  if (value.length <= 4) setBirthYear(value);
                }}
              />
              <select
                className="w-2/4 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
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
                className="w-1/4 px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
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
            <p className="text-[#B3B3B3] mb-2 text-sm">
              We use your gender to help personalize our content recommendations
              and ads for you.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                "Man",
                "Woman",
                "Non-binary",
                "Something-Else",
                "Prefer-Not-To-Say",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-gray-400"
                >
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
            <div
              className="h-full bg-green-500"
              style={{ width: "100%" }}
            ></div>
          </div>

          {/* Step Indicator and Back Button */}
          <div className="flex items-center w-[440px] mb-6">
            <IoChevronBack
              className="text-gray-400 cursor-pointer hover:text-white size-7"
              onClick={() => setStep(3)}
              style={{ marginLeft: "21px" }} // Positioned 21px from progress bar edge
            />
            <div className="flex flex-col gap-1" style={{ marginLeft: "21px" }}>
              {" "}
              {/* Align text with the form */}
              <p className="text-sm text-[#B3B3B3]">Step 3 of 3</p>
              <p className="text-sm text-[#FFFFFF] font-bold">
                Terms and Conditions
              </p>
            </div>
          </div>

          <div className="w-[325px] flex flex-col gap-2 mb-2">
            {/* Checkbox 1 */}
            <label className="flex items-center bg-[#2A2A2A] h-[80px] rounded ">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <input
                  type="checkbox"
                  className="appearance-none w-full h-full border border-[#7C7C7C] rounded bg-black hover:border-[#1ED760] checked:bg-[#1ED760] checked:border-[#1ED760]"
                  style={{
                    borderWidth: "1px", // Thinner border
                  }}
                />
                {/* Checkmark */}
                <IoIosCheckmark
                  className="absolute text-black w-6 h-6"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Center on both X and Y axes
                  }}
                />
              </div>
              <span className="text-[#FFFFFF] text-sm leading-5 ml-2">
                I want to receive news and offers from Spotify.
              </span>
            </label>

            {/* Checkbox 2 */}
            <label className="flex items-center bg-[#2A2A2A] h-[80px] rounded">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <input
                  type="checkbox"
                  className="appearance-none w-full h-full border border-[#7C7C7C] rounded bg-black hover:border-[#1ED760] checked:bg-[#1ED760] checked:border-[#1ED760]"
                  style={{
                    borderWidth: "1px", // Thinner border
                  }}
                />
                {/* Checkmark */}
                <IoIosCheckmark
                  className="absolute text-black w-6 h-6"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // Center on both X and Y axes
                  }}
                />
              </div>
              <span className="text-[#FFFFFF] text-sm leading-5 ml-2">
                Share my registration data for marketing purposes.
              </span>
            </label>
          </div>

          {/* Terms and Conditions */}
          <p className="text-sm text-[#FFFFFF] mb-6 w-[325px]">
            By clicking on register, you agree to Spotify's{" "}
            <a href="#" className="text-green-500 hover:underline">
              Terms and Conditions of Use
            </a>
            .
            <br />
            To learn more about how Spotify collects, uses, shares, and protects
            your personal data, please see{" "}
            <a href="#" className="text-green-500 hover:underline">
              Spotify's Privacy Policy
            </a>
            .
          </p>

          {/* Register Button */}
          <button
            className="w-[325px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90"
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
