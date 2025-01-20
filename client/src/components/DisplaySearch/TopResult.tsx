import React from "react";
import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";

const TopResult: React.FC<{
    artist: {
        name: string;
        uri: string;
        images: { url: string }[];
        external_urls: { spotify: string };
    };
    currentlyPlaying: string | null;
    handlePlayPause: (uri: string | null) => void;
    handleArtistClick: (spotifyUrl: string) => void;
}> = ({ artist, currentlyPlaying, handlePlayPause, handleArtistClick }) => (
    <div>
        <h2 className="text-2xl font-semibold lg:mb-0 pb-4">Top result</h2>
        <div className="bg-[#181818] rounded p-6 shadow-md w-full flex flex-col gap-4 relative group hover:bg-[#282828] transition">
            <div className="relative">
                <img
                    src={artist?.images?.[0]?.url || "/placeholder.jpg"}
                    alt={artist?.name || "Artist"}
                    className="w-[120px] h-[120px] rounded-full object-cover"
                />
                <div
                    className="absolute mt-6 right-2 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(artist?.uri);
                    }}
                >
                    {currentlyPlaying === artist?.uri ? (
                        <IoIosPause className="text-xl" />
                    ) : (
                        <FaPlay className="text-xl" />
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <p
                    onClick={() =>
                        handleArtistClick(artist?.external_urls?.spotify || "")
                    }
                    className={`text-3xl font-bold cursor-pointer hover:underline ${
                        currentlyPlaying === artist?.uri ? "text-green-500" : ""
                    }`}
                >
                    {artist?.name || "Unknown Artist"}
                </p>
                <p className="text-sm font-bold text-gray-400">Artist</p>
            </div>
        </div>
    </div>
);

export default TopResult;
