import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppData } from "@/Context/AppDataContext";
import { PiDotsThree } from "react-icons/pi";
import { HiMiniXMark } from "react-icons/hi2";
import { api } from "@/api";
import { ITrack } from "@/types/types";
import { SIDEBAR_CONSTRAINTS } from "@/Context/AppDataContext";

// Define query keys
export const queryKeys = {
  songDetails: "songDetails"
};

// Fetch song details function
export const fetchSongDetails = async () => {
  try {
    const response = await api.get("/api/tracks/offset?offset=0&limit=2");
    console.log('Song Details API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Song Details API Error:', error);
    throw error;
  }
};

const SongSidebar: React.FC = () => {
  const { 
    isRsbOpen, 
    toggleRsb, 
    setRsbMode, 
    setIsRsbOpen,
    rsbWidth 
  } = useAppData();

  // Song Details Query
  const {
    data: songData = [],
  } = useQuery({
    queryKey: [queryKeys.songDetails],
    queryFn: fetchSongDetails,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
    }, []),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Derive current and next songs
  const { currentSong, nextSong } = useMemo(() => ({
    currentSong: songData[0] || null,
    nextSong: songData[1] || null
  }), [songData]);

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
            src={currentSong?.albumCoverUrl || "https://via.placeholder.com/300"}
            alt={currentSong?.name || "Album Cover"}
            className="w-full h-auto rounded shadow-md"
            style={{ maxWidth: `${contentWidth}px` }}
          />
        </div>

        {/* Song Details */}
        <div className="mt-4" style={{ width: `${contentWidth}px` }}>
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong?.name || "Loading..."}
          </h2>
          <p className="text-sm text-gray-400 mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong?.album || "Unknown Album"}
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
              src={currentSong?.albumCoverUrl || "https://via.placeholder.com/300"}
              alt={currentSong?.artist || "Artist"}
              className="w-full h-full object-cover rounded-t-md"
            />
            <h3 className="absolute top-2 left-2 text-sm font-bold text-white bg-black px-2 py-1 rounded">
              About the Artist
            </h3>
          </div>

          {/* Artist Details */}
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white">
              {currentSong?.artist || "Unknown Artist"}
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
            <div>
              <p className="text-base font-semibold">
                {currentSong?.artist || "Unknown Artist"}
              </p>
              <p className="text-sm text-gray-400">Main Artist</p>
            </div>
            <div>
              <p className="text-base font-semibold">Baba</p>
              <p className="text-sm text-gray-400">Mega Teacher</p>
            </div>
            <div>
              <p className="text-base font-semibold">Mama</p>
              <p className="text-sm text-gray-400">Mega Mama</p>
            </div>
          </div>
        </div>

        {/* Next in Queue Card */}
        <div 
          className="rounded bg-[#1B1B1B] p-4 text-white mt-6"
          style={{ 
            width: `${contentWidth}px`, 
            height: '130px' 
          }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Next in Queue</h2>
            <button
              className="text-sm text-gray-400 hover:text-white"
              onClick={() => {
                setRsbMode("queue");
                toggleRsb("queue");
              }}
            >
              Open queue
            </button>
          </div>
          {nextSong && (
            <div className="flex items-center mt-4">
              <img
                src={nextSong.albumCoverUrl || "https://via.placeholder.com/50"}
                alt={nextSong.name}
                className="h-[50px] w-[50px] rounded object-cover"
              />
              <div className="ml-4">
                <p className="text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {nextSong.name}
                </p>
                <p className="text-sm text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap">
                  {nextSong.artist}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [currentSong, nextSong, contentWidth, generateMonthlyListeners, setRsbMode, toggleRsb]);

  // Scroll handling effect
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = (event: Event) => {
      event.preventDefault();
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll, { passive: false });
      
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="song-sidebar-container relative h-full overflow-y-auto bg-[#111213] text-white no-scrollbar"
      style={{ width: `${rsbWidth}px` }}
    >
      {/* Sticky Header */}
      <div
        className="fixed top-[63px] right-[9px] h-[67px] bg-[#111213] flex items-center justify-between px-6 shadow-md z-50 rounded-t"
        style={{ 
          width: `${rsbWidth}px`, 
          color: "#fff" 
        }}
      >
        <h1 className="text-lg font-bold">
          {currentSong ? currentSong.name : "Loading..."}
        </h1>
        <div className="flex">
          <PiDotsThree 
            className="text-[#B3B3B3] text-3xl mr-5 cursor-pointer h-6 w-6 rounded-full hover:bg-[#1B1B1B]" 
          />
          <HiMiniXMark
            className="text-[#B3B3B3] text-2xl cursor-pointer h-8 w-8 p-1 rounded-full hover:bg-[#1B1B1B]"
            onClick={() => setIsRsbOpen(false)}
          />
        </div>
      </div>
      
      {SidebarContent}
    </div>
  );
};

export default SongSidebar;