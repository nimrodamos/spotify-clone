import { RiSpotifyFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { GrInstallOption } from "react-icons/gr";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { GoHomeFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

function Navbar() {
  const { user, setUser } = useUserContext(); // Access UserContext
  const [isBrowseOn, setIsBrowseOn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user state on logout
    setUser(null);
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center font-semibold px-4 py-1">
      {/* Left: Spotify Logo */}
      <div className="flex items-center gap-2">
        <RiSpotifyFill
          color="white"
          size={"38px"}
          className="cursor-pointer mt-2 ml-2"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Center: Search Bar and Navigation */}
      <div className="flex items-center gap-2 w-full p-1 max-w-xl ml-36">
        <div className="bg-backgroundElevatedBase rounded-full p-[0.7rem] ml-6 hover:scale-[1.04]">
          <Link to="/">
            <GoHomeFill color="white" size={"27px"} className="cursor-pointer" />
          </Link>
        </div>

        <div className="flex items-center bg-backgroundElevatedBase hover:bg-backgroundElevatedHighlight text-textBase rounded-full px-2 py-2 flex-grow mr-[1.1rem]  focus-within:outline focus-within:outline-white focus-within:outline-3 focus-within:text-textBase  transition-all ease-in-out duration-150">
          <FiSearch
            color="rgb(179, 179, 179)"
            size={"27px"}
            className="cursor-pointer mr-1 hover:text-white"
            onClick={() => console.log("Search icon clicked!")}
          />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="bg-transparent px-2 py-1 rounded text-white text-base flex-grow outline-none placeholder:text-[#b3b3b3] font-normal transition-all duration-200 ease-in-out"
          />

          {/* Vertical Line and Browse Button */}
          <div className="flex items-center gap-2">
            {/* Vertical Line */}
            <div className="h-6 w-[0.1px] bg-currentColor"></div>

            {/* Browse Button */}
            <button
              data-testid="browse-button"
              className="hover:scale-[1.04] ml-1 text-white rounded-full py-1 flex items-center gap-2 transition-all duration-200 ease-in-out"
              aria-label="Browse"
              data-encore-id="buttonTertiary"
              style={{ paddingRight: '0.5rem' }} // Added padding to the right
            >
              <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="icon-svg w-6 h-6 fill-currentColor"
              >
              <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"></path>
              <path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9H3.525zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4V2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right: User Profile/Signup/Login */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            {/* Install App */}
            <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
              Explore Premium
            </p>
            <p className="flex items-center bg-black text-white text-[15px] px-3 py-1 rounded-2xl cursor-pointer gap-2">
              <GrInstallOption color="white" />
              Install App
            </p>
            {/* Notifications */}
            <img
              className="w-5 cursor-pointer"
              src={assets.bell_icon}
              alt="bell_icon"
              onClick={() => alert("Bell icon clicked!")}
            />
            {/* User Avatar Dropdown */}
            <div className="relative">
              <Avatar
                className="w-12 h-12 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <AvatarFallback className="bg-[#5c5858] text-[#EDEDED] text-lg flex items-center justify-center w-10 h-10 rounded-full">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#282828] text-[#EDEDED] rounded-lg shadow-lg z-10">
                  <ul className="flex flex-col">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("Account clicked!")}
                    >
                      Account
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("Profile clicked!")}
                    >
                      Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("Settings clicked!")}
                    >
                      Settings
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 font-semibold"
                      onClick={handleLogout}
                    >
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="bg-transparent text-[16px] font-bold rounded-2xl mr-3 mt-1 cursor-pointer hover:scale-[1.05] text-textSubdued hover:text-textBase transition-all ease-in-out"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
            <button
              className="bg-white text-black text-[15px] px-8 py-3 mt-1 rounded-3xl cursor-pointer font-bold hover:scale-[1.05] transition-all ease-in-out"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
