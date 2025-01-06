// Refactored DisplayAlbum.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/api";
import { IAlbum, ITrack } from "../types/types";

const DisplayAlbum: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<(IAlbum & { tracks: ITrack[] }) | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const response = await api.get(`/api/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error("Error fetching album:", error);
        setError("Album not found. Please check the ID.");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!album) return <p>Album not found</p>;

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 rounded"
          src={album.albumCoverUrl}
          alt={album.name}
        />
        <div className="flex flex-col">
          <p className="text-slate-200 text-lg">
            Released: {album.releaseDate}
          </p>
          <h2 className="font-bold text-5xl mb-4 md:text-7xl">{album.name}</h2>
          <p className="mt-1">
            <b>{album.artist}</b> • {album.totalTracks} tracks
          </p>
        </div>
      </div>
      <hr />
      {album.tracks.map((track) => (
        <div
          key={track._id}
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

export default DisplayAlbum;
