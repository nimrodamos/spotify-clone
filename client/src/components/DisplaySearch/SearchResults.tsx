import { CirclePlus, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { useUserContext } from "@/Context/UserContext.tsx";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // React Router's navigation hook
  const { user } = useUserContext();
  const { results } = location.state || {};

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState("All");

  if (!results) {
    return <p className="text-white">No search results available. Try searching again.</p>;
  }

  const { tracks, artists } = results;

  // Filter logic
  const filteredTracks =
    currentFilter === "All" || currentFilter === "Songs" ? tracks?.items || [] : [];
  const filteredArtists =
    currentFilter === "All" || currentFilter === "Artists" ? artists?.items || [] : [];

  // Play/Pause Handler
  const handlePlayPause = async (trackUri: string | null) => {
    if (!user || !user.accessToken) {
      console.error("User not authenticated");
      return;
    }

    try {
      if (currentlyPlaying === trackUri) {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setCurrentlyPlaying(null);
      } else {
        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackUri ? [trackUri] : [],
          }),
        });
        setCurrentlyPlaying(trackUri);
      }
    } catch (error) {
      console.error("Error controlling playback:", error);
    }
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`); // Navigate to the artist's page by ID
  };

  return (
    <div className="p-6 text-white">
      {/* Filter Buttons */}
      <div className="flex gap-4 flex-wrap mb-8">
        {["All", "Artists", "Songs", "Playlists", "Albums", "Profiles", "Podcasts & Shows"].map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`py-2 px-4 rounded-full transition ${
                currentFilter === filter
                  ? "bg-[#ffff] text-black"
                  : "bg-[#181818] text-white hover:bg-[#282828]"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Result */}
        {filteredArtists?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold lg:mb-0 pb-4">Top result</h2>
            <div className="bg-[#181818] rounded p-6 shadow-md w-full flex flex-col gap-4 relative group hover:bg-[#282828] transition">
              <div className="relative">
                <img
                  src={filteredArtists[0]?.images?.[0]?.url || "/placeholder.jpg"}
                  alt={filteredArtists[0]?.name || "Artist"}
                  className="w-[120px] h-[120px] rounded-full object-cover"
                />
                {/* Play Button */}
                <div
                  className="absolute mt-6 right-2 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause(filteredArtists[0]?.uri);
                  }}
                >
                  {currentlyPlaying === filteredArtists[0]?.uri ? (
                    <IoIosPause className="text-xl" />
                  ) : (
                    <FaPlay className="text-xl" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p
                  onClick={() => handleArtistClick(filteredArtists[0]?.id)} // Navigate on click using ID
                  className={`text-3xl font-bold cursor-pointer hover:underline ${
                    currentlyPlaying === filteredArtists[0]?.uri ? "text-green-500" : ""
                  }`}
                >
                  {filteredArtists[0]?.name || "Unknown Artist"}
                </p>
                <p className="text-sm font-bold text-gray-400">Artist</p>
              </div>
            </div>
          </div>
        )}

        {/* Songs Section */}
        {filteredTracks?.length > 0 && (
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold lg:mb-0 pb-4">Songs</h2>
            <div className="flex flex-col gap-3">
              {filteredTracks.slice(0, 4).map((track) => (
                <div
                  key={track.id}
                  className="group flex items-center justify-between hover:bg-[#282828] transition pr-4 rounded relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={track.album?.images?.[0]?.url || "/placeholder.jpg"}
                        alt={track.name || "Song"}
                        className="w-[50px] h-[50px] rounded-lg object-cover"
                      />
                      {/* Play/Pause on Hover */}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(track.uri);
                        }}
                      >
                        {currentlyPlaying === track.uri ? (
                          <IoIosPause className="text-white text-2xl" />
                        ) : (
                          <FaPlay size={14} className="text-white text-2xl" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold truncate ${
                          currentlyPlaying === track.uri ? "text-green-500" : "text-white"
                        } hover:underline cursor-pointer`}
                      >
                        {track.name || "Unknown Track"}
                      </p>
                      <p className="text-sm text-gray-400 truncate hover:underline cursor-pointer">
                        {track.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
                      </p>
                    </div>
                  </div>
                  {/* Duration and Hover Icons */}
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <CirclePlus
                      size={15}
                      className="opacity-0 group-hover:opacity-100 hover:scale-[1.04] mr-6 transition-opacity cursor-pointer"
                    />
                    <span>{formatDuration(track.duration_ms)}</span>
                    <Ellipsis className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format track duration
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default SearchResults;
