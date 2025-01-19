import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";
import { GrInstallOption } from "react-icons/gr";
import { RxExternalLink } from "react-icons/rx";
import { GoBell, GoBellFill } from "react-icons/go";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

const UserActions: React.FC = () => {
  const { user, setUser } = useUserContext();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    setUser(null);
    navigate("/");
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="flex items-center font-medium gap-7 relative"
      ref={dropdownRef}
    >
      {user ? (
        <>
          <button className="text-black text-sm bg-white hover:bg-[#f0f0f0] hover:scale-[1.04] font-bold  rounded-3xl px-4 py-[0.4rem] min-w-[150px]">
            Explore Premium
          </button>
          <button className="flex items-center bg-black text-white hover:scale-[1.04] font-extrabold text-[13px] rounded-2xl cursor-pointer gap-1 min-w-[150px]">
            <GrInstallOption size={15} color="white" />
            Install App
          </button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button onClick={() => navigate("/whatsNew")}>
                {window.location.pathname === "/whatsNew" ? (
                  <GoBellFill
                    size={17}
                    className="text-white hover:scale-[1.04] hover:text-textBase"
                  />
                ) : (
                  <GoBell
                    size={17}
                    className="text-currentColor hover:scale-[1.04] hover:text-textBase"
                  />
                )}
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              side="bottom"
              align="center"
              className="bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mt-4"
            >
              <div className="p-2 text-sm">What's new</div>
            </HoverCardContent>
          </HoverCard>
          <Avatar
            className="rounded-full cursor-pointer bg-backgroundHighlight mr-1 p-2 hover:scale-[1.04] transition-all ease-in-out duration-150"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <AvatarFallback className="bg-essentialPositive text-[#EDEDED] text-lg flex items-center justify-center w-8 h-8 rounded-full">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {dropdownOpen && (
            <div className="absolute right-0 mt-[19.7rem] mr-1 w-48 bg-[#282828] text-[#EDEDED] rounded shadow-lg z-[9999]">
              <ul className="flex flex-col text-sm p-1 font-medium">
                <li
                  className="flex justify-between items-center p-3 rounded cursor-pointer hover:bg-backgroundTintedHighlight"
                  onClick={() => {
                    console.log("Account clicked!");
                    setDropdownOpen(false);
                  }}
                >
                  Account <RxExternalLink size={20} className="font-bold" />
                </li>
                <li
                  className="cursor-pointer hover:bg-backgroundTintedHighlight p-3 rounded"
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                >
                  Profile
                </li>
                <button
                  className="flex justify-between items-center cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                  title="Upgrade to premium"
                  onClick={() => {
                    console.log("Upgrade clicked!");
                    setDropdownOpen(false);
                  }}
                >
                  Upgrade to Premium{" "}
                  <RxExternalLink size={20} className="font-bold" />
                </button>
                <li
                  className="cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                  onClick={() => {
                    console.log("Settings clicked!");
                    setDropdownOpen(false);
                  }}
                >
                  Settings
                </li>
                <hr className="border-t border-gray-600" />
                <li
                  className="cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
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
  );
};

export default UserActions;
