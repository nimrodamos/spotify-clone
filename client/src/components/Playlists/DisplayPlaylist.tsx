import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IPlaylist, ITrack } from "../../types/types";
import { api } from "@/api";

// פונקציה לשליפת פרטי הפלייליסט לפי ID
const fetchPlaylistById = async (
  id: string
): Promise<IPlaylist & { tracks: ITrack[] }> => {
  const response = await api.get(`/api/playlists/${id}`);
  return response.data;
};

const DisplayPlaylist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  // שליפת פרטי הפלייליסט באמצעות React Query
  const {
    data: playlist,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchPlaylistById(id as string),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (queryError) {
      setError("Failed to fetch playlist.");
    }
  }, [queryError]);

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!playlist)
    return <p className="text-center text-xl">Playlist not found</p>;

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 rounded"
          src={playlist.tracks[0]?.albumCoverUrl || "/default-playlist.jpg"}
          alt={playlist.PlaylistTitle}
        />
        <div className="flex flex-col">
          <h2 className="font-bold text-5xl mb-4 md:text-7xl">
            {playlist.PlaylistTitle}
          </h2>
          <p className="mt-1">
            {playlist.description || "No description available"}
          </p>
        </div>
      </div>
      <hr />
      {playlist.tracks.map((track) => (
        <div
          key={track.spotifyTrackId}
          className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-4 hover:bg-[#282828] text-sm"
        >
          <p className="flex items-center">
            <span className="mr-4">{track.name}</span>
            <img
              className="w-8 h-8 rounded"
              src={track.albumCoverUrl}
              alt={track.name}
            />
          </p>
          <p>{track.artist}</p>
          <p className="hidden sm:block">
            {Math.floor(track.durationMs / 60000)}:
            {((track.durationMs % 60000) / 1000).toFixed(0).padStart(2, "0")}
          </p>
        </div>
      ))}
    </>
  );
};

export default DisplayPlaylist;
