import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";
import { GrInstallOption } from "react-icons/gr";
import { assets } from "@/assets/assets";
import { RxExternalLink } from "react-icons/rx";

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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="flex items-center font-medium gap-4 relative" ref={dropdownRef}>

            {user ? (
                <>
                    <p className="flex items-center bg-black text-white text-[15px] px-3 py-1 rounded-2xl cursor-pointer gap-2">
                        <GrInstallOption color="white" />
                        Install App
                    </p>
                    <img
                        className="w-5 cursor-pointer"
                        src={assets.bell_icon} 
                        alt="bell_icon"
                    />
                    <Avatar
                        className="w-12 h-12 rounded-full cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <AvatarFallback className="bg-essentialPositive text-[#EDEDED] text-lg flex items-center justify-center w-10 h-10 rounded-full">
                            {user.displayName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-[19.2rem] mr-1 w-48 bg-[#282828] text-[#EDEDED] rounded shadow-lg z-10">
                            <ul className="flex flex-col text-sm p-1 font-medium">
                                <li
                                    className="flex justify-between items-center p-3 rounded cursor-pointer hover:bg-backgroundTintedHighlight"
                                    onClick={() => console.log("Account clicked!")}
                                >
                                    Account <RxExternalLink size={20} className="font-bold" />
                                </li>
                                <li
                                    className=" cursor-pointer hover:bg-backgroundTintedHighlight p-3 rounded"
                                    onClick={() => console.log("Profile clicked!")}
                                >
                                    Profile
                                </li>
                                <li
                                    className=" flex justify-between items-center cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                                    onClick={() => console.log("Profile clicked!")}
                                >
                                    Upgrade to Premium <RxExternalLink size={20} className="font-bold" />
                                </li>
                                <li
                                    className=" cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                                    onClick={() => console.log("Settings clicked!")}
                                >
                                    Settings
                                </li>
                                <hr className="border-t border-gray-600" />
                                <li
                                    className="cursor-pointer p-3 rounded hover:bg-backgroundTintedHighlight"
                                    onClick={handleLogout}
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
