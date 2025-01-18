import React from 'react';
import { ITrack } from '@/types/types';

interface TopTracksSectionProps {
  tracks: ITrack[];
}

export const TopTracksSection: React.FC<TopTracksSectionProps> = ({ tracks }) => {
  return (
    <div className="top-[764px] left-0 bg-[#121212] w-full" style={{ backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w pl-[37px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Top tracks this month</h2>
          <a href="/top-tracks" className="text-sm text-gray-400 hover:text-white">
            Show all
          </a>
        </div>
        <p className="text-sm text-gray-400 mb-4">Only visible to you</p>
        <ul>
          {tracks.map((track, index) => (
            <li
              key={track._id}
              className="flex justify-between items-center py-2 hover:bg-[#1F1F1F] px-4 rounded-md"
            >
              <div className="flex items-center">
                <p className="text-sm text-gray-400 w-4">{index + 1}</p>
                <img
                  src={track.albumCoverUrl || "https://via.placeholder.com/50"}
                  alt={track.name}
                  className="w-[40px] h-[40px] ml-4 object-cover rounded"
                />
                <div className="ml-4">
                  <p className="text-sm text-white">{track.name}</p>
                  <p className="text-xs text-gray-400">{track.artist}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">{track.album}</p>
              <p className="text-sm text-gray-400">
                {(track.durationMs / 60000).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};