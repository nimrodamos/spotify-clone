import React, { useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

const PasswordRecoveryPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = () => {
    console.log('Email or username:', email);
  };

  return (
<div className="flex flex-col items-center justify-start min-h-screen bg-[#121212] text-white">
  {/* Spotify Icon */}
  <FaSpotify className="text-5xl text-green-500 mt-6 mb-6" />

  {/* Left-aligned Header, Description, and Link */}
  <div className="w-[300px] text-left">
    <h1 className="text-3xl font-bold mb-4">Password Reset</h1>
    <p className="text-sm  mb-8">
      Enter your email address or username,<br /> and we’ll send you a link to reset your password.
    </p>
      {/* Email Input */}
  <div className="mb-4 w-[300px]">
    <label className="block text-sm font-medium mb-2">Email or username</label>
    <input
      type="email"
      className="w-full px-3 py-[0.76rem] bg-transparent rounded-md border border-white/50 text-white focus:ring-2 focus:ring-green-500 outline-none hover:border-white"
      placeholder="Email or username"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
    <div className="my-6">
      <a
        href="#"
        className="text-sm text-[#E4E4E4] hover:text-green-500 underline"
      >
        Need help?
      </a>
    </div>
  </div>



  {/* Submit Button */}
  <button
    className="w-[300px] py-[0.85rem] bg-green-500 text-black font-bold text-sm rounded-full shadow-md transform transition duration-300 hover:scale-105 hover:opacity-90 mb-10"
    onClick={handlePasswordRecovery}
  >
    Send Link
  </button>

  {/* Legal Text Sticking to Bottom */}
  <div className="absolute bottom-4 text-center text-xs text-gray-400 max-w-[80%]">
    This site is protected by reCAPTCHA and the Google{' '} <br />
    <a href="#" className="text-[#E4E4E4] hover:text-green-500">
      Privacy Policy
    </a>{' '}
    and{' '}
    <a href="#" className="text-[#E4E4E4] hover:text-green-500">
      Terms of Service
    </a>{' '}
    apply.
  </div>
</div>

  );
};

export default PasswordRecoveryPage;
