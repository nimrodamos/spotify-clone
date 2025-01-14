import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { ITrack } from "@/types/types";
import { api } from "@/api";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

const DisplaySong: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tracks, loading: contextLoading, error: contextError } = useAppData();
  const [track, setTrack] = useState<ITrack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const foundTrack = tracks.find((t) => t._id === id);
        if (foundTrack) {
          setTrack(foundTrack);
        } else {
          const response = await api.get(`/api/tracks/${id}`);
          setTrack(response.data);
        }
      } catch (err) {
        setError("Failed to fetch track data");
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchTrack();
    }
  }, [id, tracks, contextLoading]);

  if (loading) return <p>Loading track...</p>;
  if (error || contextError) return <p>{error || contextError}</p>;
  if (!track) return <p>Track not found</p>;

  return (
    <div className="bg-black text-white h-screen p-8">
      <div className="flex gap-8 items-center">
        <img
          src={track.albumCoverUrl}
          alt={track.name}
          className="w-[200px] h-[200px] object-cover rounded-md"
        />
        <div>
          <p className="text-sm text-gray-400">Song</p>
          <h1 className="text-6xl font-bold mb-4">{track.name}</h1>
          <p className="text-lg">
            {track.artist} • {track.album} •{" "}
            {Math.floor(track.durationMs / 60000)}:
            {((track.durationMs % 60000) / 1000).toFixed(0).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 items-center">
        <AiFillPlayCircle size={70} color="LimeGreen" />
        <FaCheckCircle size={32} color="LimeGreen" />
        <div className="text-white text-2xl cursor-pointer">&#8230;</div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended</h2>
        {/* Render recommended tracks here if available */}
      </div>
    </div>
  );
};

export default DisplaySong;
