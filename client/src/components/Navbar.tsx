import { RiSpotifyFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { GrInstallOption } from "react-icons/gr";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const isLoggedIn = false;

  return (
    <div className="w-full flex justify-between items-center font-semibold px-4 py-2 bg-black">
      <div className="flex items-center gap-2">
        <RiSpotifyFill color="white" size={"50px"} className="cursor-pointer" />
      </div>

      <div className="flex items-center gap-4 w-full max-w-xl">
        <GoHomeFill color="white" size={"50px"} className="cursor-pointer" />
        <img
          className="w-8 cursor-pointer"
          src={assets.home_icon}
          alt="Home Icon"
        />

        <div className="flex items-center bg-[#121212] text-white rounded-full px-6 py-3 flex-grow gap-4">
          <CiSearch
            color="white"
            size={"30px"}
            className="cursor-pointer"
            onClick={() => console.log("Home icon clicked!")}
          />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="bg-transparent text-white text-lg flex-grow outline-none placeholder:text-gray-400"
          />

          <svg
            data-encore-id="icon"
            role="img"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-7 h-7 text-gray-400 hover:text-white cursor-pointer"
          >
            <path
              d="M4 2a1 1 0 0 1 1-1h14a1 1 0 1 1 1 1v4H4V2zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834c1.933 0 3.5-1.044 3.5-2.333 0-1.289-1.567-2.333-3.5-2.333S8.5 14.21 8.5 15.5c0 1.289 1.567 2.333 3.5 2.333z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* בדיקה אם המשתמש מחובר */}
        {isLoggedIn ? (
          <>
            <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
              Explore Premium
            </p>
            <p className="flex items-center bg-black text-white text-[15px] px-3 py-1 rounded-2xl cursor-pointer gap-2">
              <GrInstallOption color="white" />
              Install App
            </p>
          </>
        ) : (
          <>
            <button className="bg-transparent text-white text-[15px] px-4 py-1 rounded-2xl cursor-pointer">
              Signup
            </button>
            <button className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl cursor-pointer">
              Login
            </button>
          </>
        )}
        <img
          className="w-5 cursor-pointer"
          src={assets.bell_icon}
          alt="bell_icon"
          onClick={() => alert("Bell icon clicked!")}
        />
        <Avatar className="w-12 h-12 rounded-full cursor-pointer">
          <AvatarFallback className="bg-green-500 text-white text-lg flex items-center justify-center w-full h-full rounded-full">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Navbar;
