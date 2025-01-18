import React from 'react';
import { IArtist } from '@/types/types';

interface FollowersSectionProps {
  followers: IArtist[];
}

export const FollowersSection: React.FC<FollowersSectionProps> = ({ followers }) => {
  return (
    <div className="absolute top-[1079px] left-0 bg-[#121212] w-full py-6" style={{ backdropFilter: "blur(4px)" }}>
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
              className="text-center hover:bg-[#1F1F1F] h-[235px] w-[180px] rounded px-2 py-2"
            >
              <img
                src={artist.images?.[0]?.url || "https://via.placeholder.com/50"}
                alt={artist.name}
                className="w-[160px] h-[160px] object-cover rounded-full shadow-md"
              />
              <p className="text-sm mt-2 text-white text-left">{artist.name}</p>
              <p className="text-sm text-gray-400 text-left">Profile</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};