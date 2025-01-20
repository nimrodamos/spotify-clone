import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IArtist } from '@/types/types';
import { AiFillPlayCircle } from "react-icons/ai";

interface FollowersSectionProps {
  followers: IArtist[];
}

export const FollowersSection: React.FC<FollowersSectionProps> = ({ followers }) => {
  const navigate = useNavigate();

  // Extract Spotify ID from the artist's external_urls.spotify
  const extractSpotifyId = (artist: IArtist) => {
    return artist.external_urls?.spotify?.split("/").pop() || "";
  };

  // Handle Artist Click
  const handleArtistClick = (artist: IArtist) => {
    const spotifyId = extractSpotifyId(artist);
    if (spotifyId) {
      navigate(`/artist/${spotifyId}`);
    }
  };

  return (
    <div className="top-[1079px] left-0 bg-[#121212] w-full py-6" style={{ backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w pl-[37px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Followers</h2>
          <a href="/followers" className="text-sm text-gray-400 hover:text-white">
            Show all
          </a>
        </div>
        <div className="flex">
          {followers.map((artist) => (
            <div
              key={artist._id}
              className="group text-center hover:bg-[#1F1F1F] h-[235px] w-[180px] rounded px-2 py-2 cursor-pointer"
              onClick={() => handleArtistClick(artist)}
            >
              <div className="relative w-[160px] h-[160px] mx-auto">
                <img
                  src={artist.images?.[0]?.url || "https://via.placeholder.com/50"}
                  alt={artist.name}
                  className="w-full h-full object-cover rounded-full shadow-md"
                />
                <button className="absolute bottom-0 right-0 text-[#1ED760] text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute bg-black w-[50px] h-[50px] rounded-full opacity-80"></div>
                    <AiFillPlayCircle
                      size={"65px"}
                      color="#1ed760"
                      className="relative"
                    />
                  </div>
                </button>
              </div>
              <p className="text-sm mt-2 text-white text-left">{artist.name}</p>
              <p className="text-sm text-gray-400 text-left">Profile</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};