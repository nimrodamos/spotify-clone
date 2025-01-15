import React, { useState, useEffect } from "react";
import { useAppData } from "@/Context/AppDataContext";
import { PiDotsThree } from "react-icons/pi";
import { HiMiniXMark } from "react-icons/hi2";
import { api } from "@/api"; // Import API abstraction
import { ITrack } from "@/types/types"; // Import track type

const SongSidebar: React.FC = () => {
  const { isRsbOpen, toggleRsb, setRsbMode, setIsRsbOpen } = useAppData();
  const [sidebarWidth, setSidebarWidth] = useState(285);
  const [currentSong, setCurrentSong] = useState<ITrack | null>(null);
  const [nextSong, setNextSong] = useState<ITrack | null>(null);

  useEffect(() => {
    const currentWidth = isRsbOpen ? 285 : 0;
    setSidebarWidth(currentWidth);
  }, [isRsbOpen]);

  useEffect(() => {
    // Fetch two random songs
    async function fetchSongs() {
      try {
        const response = await api.get("/api/tracks");
        const tracks: ITrack[] = response.data;

        if (tracks.length > 0) {
          const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
          setCurrentSong(shuffledTracks[0]);
          setNextSong(shuffledTracks[1]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }

    fetchSongs();
  }, []);

  const generateMonthlyListeners = () => {
    return Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000);
  };

  return (
    <div
      className="song-sidebar-container relative h-full overflow-y-auto bg-[#111213] text-white"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Sticky Header */}
      <div
        className="fixed top-[8.2%] right-0 h-[67px] bg-[#111213] flex items-center justify-between px-6 shadow-md z-50 rounded-t"
        style={{ width: `${sidebarWidth}px`, color: "#fff" }}
      >
        <h1 className="text-lg font-bold">
          {currentSong ? currentSong.name : "Loading..."}
        </h1>
        <div className="flex">
          <PiDotsThree className="text-[#B3B3B3] text-3xl mr-5 cursor-pointer h-6 w-6 rounded-full hover:bg-[#1B1B1B]" />

          <HiMiniXMark
            className="text-[#B3B3B3] text-2xl cursor-pointer h-8 w-8 p-1 rounded-full hover:bg-[#1B1B1B]"
            onClick={() => {
              // Directly set isRsbOpen to false
              setIsRsbOpen(false);
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 mt-[67px]">
        {/* Album Cover */}
        <div className="w-full">
          <img
            src={
              currentSong?.albumCoverUrl || "https://via.placeholder.com/300"
            }
            alt={currentSong?.name || "Album Cover"}
            className="w-[250px] h-[250px] rounded shadow-md"
          />
        </div>

        {/* Song Details */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong?.name || "Loading..."}
          </h2>
          <p className="text-sm text-gray-400 mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong?.album || "Unknown Album"}
          </p>
        </div>

        {/* About the Artist Card */}
        <div className="bg-[#1B1B1B] w-[250px] h-[350px] rounded-md shadow-md mt-6">
          {/* Artist Picture */}
          <div className="relative w-full h-[48%]">
            <img
              src={
                currentSong?.albumCoverUrl || "https://via.placeholder.com/300"
              }
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
        <div className="h-[250px] w-[250px] rounded bg-[#1B1B1B] p-4 text-white mt-6">
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
        <div className="h-[130px] w-[250px] rounded bg-[#1B1B1B] p-4 text-white mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Next in Queue</h2>
            <button
              className="text-sm text-gray-400 hover:text-white"
              onClick={() => {
                setRsbMode("queue"); // Set the mode to "queue"
                toggleRsb("queue"); // Open the sidebar in queue mode
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
    </div>
  );
};

export default SongSidebar;
