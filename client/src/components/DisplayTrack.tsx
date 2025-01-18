import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { ITrack, IArtist } from "@/types/types";
import { api } from "@/api";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { getDominantColor } from "@/lib/getDominantColor";

const DisplayTrack: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tracks, loading: contextLoading, error: contextError } = useAppData();
  const [track, setTrack] = useState<ITrack | null>(null);
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("#121212");

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

  useEffect(() => {
    if (track?.albumCoverUrl) {
      getDominantColor(track.albumCoverUrl).then((color) => {
        setBackground(color);
      });
    }
  }, [track]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        if (track?.artist) {
          const artistResponse = await api.get(
            `/api/artists/name/${track.artist}`
          );
          setArtist(artistResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch artist data");
      }
    };

    if (track) {
      fetchArtist();
    }
  }, [track]);

  if (loading) return <p>Loading track...</p>;
  if (error || contextError) return <p>{error || contextError}</p>;
  if (!track) return <p>Track not found</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="max-w-screen-lg mx-auto">
      <div
        className="p-5"
        style={{
          background: `linear-gradient(to bottom, ${background}, #121212)`,
        }}
      >
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
          <button
            onClick={() => setAdded(!added)}
            className="focus:outline-none"
          >
            {added ? (
              <FaCheckCircle size={32} color="LimeGreen" />
            ) : (
              <BiPlusCircle size={32} />
            )}
          </button>
          <div className="text-white text-2xl cursor-pointer">&#8230;</div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <img
            src={artist.images[0].url}
            alt={track.name}
            className="w-[70px] h-[70px] object-cover rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-l font-bold ">artist</h1>
            <h1 className="text-l font-bold ">{track.artist}</h1>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended</h2>
          {/* Render recommended tracks here if available */}
        </div>
      </div>
    </div>
  );
};

export default DisplayTrack;
