import React from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { GoHome, GoHomeFill } from "react-icons/go";
import { useLocation } from "react-router-dom";
import { useUserContext } from "@/Context/UserContext.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";

const SearchBar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user } = useUserContext();

  return (
    <div
      className={`flex items-center gap-3 w-full max-w-xl ${
        user ? "ml-[23rem]" : "ml-[12rem]"
      }`}
    >
      <div className="bg-backgroundElevatedBase rounded-full p-[0.7rem] mt-1 hover:scale-[1.04]">
        <Link to="/">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-pointer">
                {isHome ? (
                  <GoHomeFill color="white" size={27} />
                ) : (
                  <GoHome color="white" size={27} />
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side="bottom"
              align="center"
              className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mt-4"
            >
              <p>Home</p>
            </HoverCardContent>
          </HoverCard>
        </Link>
      </div>
      <div className="flex items-center bg-backgroundElevatedBase hover:bg-backgroundElevatedHighlight text-textBase rounded-full px-2 py-2 flex-grow mr-[1.1rem]  focus-within:outline focus-within:outline-white focus-within:outline-3 focus-within:text-textBase  transition-all ease-in-out duration-150">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer">
              <FiSearch
                color="rgb(179, 179, 179)"
                size={27}
                className="mr-1 hover:text-white"
                onClick={() => console.log("Search icon clicked!")}
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mt-4">
            <p>Search</p>
          </HoverCardContent>
        </HoverCard>
        <input
          type="text"
          placeholder="What do you want to play?"
          className="bg-transparent px-2 py-1 rounded text-white text-base flex-grow outline-none placeholder:text-[#b3b3b3] font-normal transition-all duration-200 ease-in-out"
        />
        <div className="flex items-center gap-2">
          <div className="h-6 w-[0.1px] bg-currentColor"></div>
          <button>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <Link to="/browse">
                    {location.pathname === "/browse" ? (
                      <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="icon-svg w-6 h-6 fill-white"
                      >
                        <path d="M4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4V2zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834c1.933 0 3.5-1.044 3.5-2.333 0-1.289-1.567-2.333-3.5-2.333S8.5 14.21 8.5 15.5c0 1.289 1.567 2.333 3.5 2.333z"></path>
                      </svg>
                    ) : (
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
                    )}
                  </Link>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="bottom"
                align="center"
                className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mt-4"
              >
                <p>Browse</p>
              </HoverCardContent>
            </HoverCard>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
