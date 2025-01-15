import React, { useState, useEffect } from "react";
import { useAppData } from "@/Context/AppDataContext";
import { HiMiniXMark } from "react-icons/hi2";
import { api } from "@/api"; // Import API abstraction
import { ITrack } from "@/types/types"; // Import track type

const QueueSidebar: React.FC = () => {
  const { isRsbOpen, setIsRsbOpen } = useAppData(); // Access RSB state
  const [sidebarWidth, setSidebarWidth] = useState(285); // Default RSB width
  const [currentSong, setCurrentSong] = useState<ITrack | null>(null); // Current song
  const [nextSongs, setNextSongs] = useState<ITrack[]>([]); // 20 next songs

  useEffect(() => {
    // Dynamically adjust width if RSB is resizable
    const currentWidth = isRsbOpen ? 285 : 0;
    setSidebarWidth(currentWidth);
  }, [isRsbOpen]);

  useEffect(() => {
    // Fetch random songs
    async function fetchSongs() {
      try {
        const response = await api.get("/api/tracks");
        const tracks: ITrack[] = response.data;

        if (tracks.length > 0) {
          const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
          setCurrentSong(shuffledTracks[0]);
          setNextSongs(shuffledTracks.slice(1, 21)); // Get 20 songs
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }

    fetchSongs();
  }, []);

  return (
    <div
      className="queue-sidebar-container relative h-full overflow-y-auto bg-[#111213] text-white"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Sticky Header */}
      <div
        className="fixed top-[8.2%] right-0 h-[67px] bg-[#111213] flex items-center justify-between px-6 shadow-md z-50 rounded-t"
        style={{ width: `${sidebarWidth}px`, color: "#fff" }}
      >
        <h1 className="text-lg font-bold">Queue</h1>
        <HiMiniXMark
          className="text-[#B3B3B3] text-2xl cursor-pointer h-8 w-8 p-1 rounded-full hover:bg-[#1B1B1B]"
          onClick={() => {
            // Close the sidebar
            setIsRsbOpen(false);
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 mt-[67px]">
        {/* Now Playing Section */}
        <h2 className="text-md font-bold text-[#EAEAEA] mb-4">Now playing</h2>
        {currentSong && (
          <div className="h-[60px] w-[250px] hover:bg-[#1C1C1C] rounded flex items-center p-2">
            <img
              src={currentSong.albumCoverUrl || "https://via.placeholder.com/50"}
              alt={currentSong.name}
              className="h-[50px] w-[50px] rounded object-cover"
            />
            <div className="ml-4">
              <p className="text-sm font-bold text-[#1CC458] truncate">
                {currentSong.name}
              </p>
              <p className="text-sm text-[#EAEAEA] truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <h2 className="text-md font-bold text-[#EAEAEA] mt-6 mb-4">Next up</h2>
        <div className="space-y-1">
          {nextSongs.map((song, index) => (
            <div
              key={index}
              className="h-[60px] w-[250px] hover:bg-[#1C1C1C] rounded flex items-center p-2"
            >
              <img
                src={song.albumCoverUrl || "https://via.placeholder.com/50"}
                alt={song.name}
                className="h-[50px] w-[50px] rounded object-cover"
              />
              <div className="ml-4">
                <p className="text-sm font-bold text-[#FFFFFF] truncate">
                  {song.name}
                </p>
                <p className="text-sm text-[#787878] truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueSidebar;
