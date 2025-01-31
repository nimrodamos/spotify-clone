import React, { useState } from "react";
import { IoIosPause } from "react-icons/io";
import { FaPlay, FaCheckCircle } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { Ellipsis } from "lucide-react";

const SongsSection: React.FC<{
  tracks: {
    id: string;
    uri: string;
    name: string;
    album: {
      images: { url: string }[];
    };
    artists: { name: string }[];
    duration_ms: number;
  }[];
  currentlyPlaying: string | null;
  handlePlayPause: (uri: string | null) => void;
}> = ({ tracks, currentlyPlaying, handlePlayPause }) => {
  const [addedTracks, setAddedTracks] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const toggleAdded = (trackId: string) => {
    setAddedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-semibold lg:mb-0 pb-4">Songs</h2>
      <div className="flex flex-col gap-3">
        {tracks.slice(0, 4).map((track) => (
          <div
            key={track.id}
            className="group flex items-center justify-between hover:bg-[#282828] transition pr-4 rounded relative"
            onMouseEnter={() => setHoveredTrack(track.id)}
            onMouseLeave={() => setHoveredTrack(null)}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={track.album?.images?.[0]?.url || "/placeholder.jpg"}
                  alt={track.name || "Song"}
                  className="w-[50px] h-[50px] rounded-lg object-cover"
                />
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
                    currentlyPlaying === track.uri
                      ? "text-green-500"
                      : "text-white"
                  } hover:underline cursor-pointer`}
                >
                  {track.name || "Unknown Track"}
                </p>
                <p className="text-sm text-gray-400 truncate hover:underline cursor-pointer">
                  {track.artists?.map((artist) => artist.name).join(", ") ||
                    "Unknown Artist"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              {hoveredTrack === track.id && (
                <button
                  onClick={() => toggleAdded(track.id)}
                  className="focus:outline-none transition-all opacity-100"
                >
                  {addedTracks[track.id] ? (
                    <FaCheckCircle size={20} color="LimeGreen" />
                  ) : (
                    <BiPlusCircle size={20} color="darkgrey" />
                  )}
                </button>
              )}

              <span>{formatDuration(track.duration_ms)}</span>
              <Ellipsis className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default SongsSection;
