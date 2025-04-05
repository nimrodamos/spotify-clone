import React, { useRef, useMemo, useCallback } from "react";
import { useAppData } from "@/Context/AppDataContext";
import { PiDotsThree } from "react-icons/pi";
import { HiMiniXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import { SIDEBAR_CONSTRAINTS } from "@/Context/AppDataContext";

const SongSidebar: React.FC = () => {
  const { 
    setIsRsbOpen,
    setRsbWidth,
    rsbWidth,
    currentTrack
  } = useAppData();

  const handleClose = () => {
    setIsRsbOpen(false);
    setRsbWidth(SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH);
  };

  // Dynamic width calculations
  const contentWidth = useMemo(() => {
    return Math.max(
      SIDEBAR_CONSTRAINTS.MIN_WIDTH, 
      Math.min(rsbWidth, SIDEBAR_CONSTRAINTS.MAX_WIDTH)
    ) - 40; // Subtract padding
  }, [rsbWidth]);

  // Generate monthly listeners
  const generateMonthlyListeners = useCallback(() => {
    return Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000);
  }, []);

  // Memoize sidebar content
  const SidebarContent = useMemo(() => {
    return (
      <div className="p-4 mt-[67px]" style={{ width: `${contentWidth}px` }}>
        {/* Album Cover */}
        <div className="w-full">
          <img
            src={currentTrack?.album?.images?.[0]?.url || "https://via.placeholder.com/300"}
            alt={currentTrack?.name || "Album Cover"}
            className="w-full h-auto rounded shadow-md"
            style={{ maxWidth: `${contentWidth}px` }}
          />
        </div>

        {/* Song Details */}
        <div className="mt-4" style={{ width: `${contentWidth}px` }}>
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
            {currentTrack?.name || "No track playing"}
          </h2>
          <p className="text-sm text-gray-400 mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
            {currentTrack?.artists?.map(artist => artist.name).join(", ") || "Unknown Artist"}
          </p>
        </div>

        {/* About the Artist Card */}
        <div 
          className="bg-[#1B1B1B] rounded-md shadow-md mt-6"
          style={{ 
            width: `${contentWidth}px`, 
            height: '350px' 
          }}
        >
          {/* Artist Picture */}
          <div className="relative w-full h-[48%]">
            <img
              src={currentTrack?.album?.images?.[0]?.url || "https://via.placeholder.com/300"}
              alt={currentTrack?.artists?.[0]?.name || "Artist"}
              className="w-full h-full object-cover rounded-t-md"
            />
            <h3 className="absolute top-2 left-2 text-sm font-bold text-white bg-black px-2 py-1 rounded">
              About the Artist
            </h3>
          </div>

          {/* Artist Details */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white">
              {currentTrack?.artists?.[0]?.name || "Unknown Artist"}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {generateMonthlyListeners().toLocaleString()} monthly listeners
            </p>
            <p className="text-sm text-gray-400 mt-4 overflow-hidden text-ellipsis whitespace-nowrap">
              Placeholder text for artist description
            </p>
          </div>
        </div>

        {/* Credits Card */}
        <div 
          className="rounded bg-[#1B1B1B] p-4 text-white mt-6"
          style={{ 
            width: `${contentWidth}px`, 
            height: '250px' 
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Credits</h2>
            <button className="text-sm text-gray-400 hover:text-white">
              Show all
            </button>
          </div>
          <div className="space-y-4">
            {currentTrack?.artists?.map((artist, index) => (
              <div key={index}>
                <p className="text-base font-semibold">
                  {artist.name}
                </p>
                <p className="text-sm text-gray-400">
                  {index === 0 ? "Main Artist" : "Featured Artist"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [currentTrack, contentWidth, generateMonthlyListeners]);

  // Scroll handling effect
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={scrollContainerRef}
      className="song-sidebar-container relative h-full overflow-y-auto bg-[#111213] text-white no-scrollbar"
      style={{ width: rsbWidth }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sticky Header */}
      <div
        className="fixed top-[63px] right-[9px] h-[67px] bg-[#111213] flex items-center justify-between px-6 shadow-md z-50 rounded-t"
        style={{ width: rsbWidth }}
      >
        <h1 className="text-lg font-bold truncate">
          {currentTrack?.name || "No track playing"}
        </h1>
        <div className="flex items-center shrink-0">
          <PiDotsThree 
            className="text-[#B3B3B3] text-3xl mr-5 cursor-pointer h-6 w-6 rounded-full hover:bg-[#1B1B1B]" 
          />
          <HiMiniXMark
            className="text-[#B3B3B3] text-2xl cursor-pointer h-8 w-8 p-1 rounded-full hover:bg-[#1B1B1B]"
            onClick={handleClose}
          />
        </div>
      </div>
      
      {SidebarContent}
    </motion.div>
  );
};

export default SongSidebar;