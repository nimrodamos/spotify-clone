import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/api";
import { IPlaylist, ITrack } from "../types/types";

const DisplayPlaylist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<
    (IPlaylist & { tracks: ITrack[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const response = await api.get(`/api/playlists/${id}`);
        setPlaylist(response.data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setError("Playlist not found. Please check the ID.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return <p>Playlist not found</p>;

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 rounded"
          src={playlist.customAlbumCover || ""}
          alt={playlist.PlaylistTitle}
        />
        <div className="flex flex-col">
          <h2 className="font-bold text-5xl mb-4 md:text-7xl">
            {playlist.PlaylistTitle}
          </h2>
          <p className="mt-1">{playlist.description}</p>
        </div>
      </div>
      <hr />
      {playlist.tracks.map((track) => (
        <div
          key={track.name}
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
