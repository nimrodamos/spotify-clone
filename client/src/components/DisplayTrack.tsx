import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { ITrack, IArtist } from "@/types/types";
import { api } from "@/api";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { getDominantColor } from "@/lib/getDominantColor";
import { useQuery } from "@tanstack/react-query";

const DisplayTrack: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tracks, loading: contextLoading, error: contextError } = useAppData();
  const [added, setAdded] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("#121212");
  const [isHovered, setIsHovered] = useState(false);

  // Fetch track data with React Query
  const {
    data: track,
    isLoading: trackLoading,
    error: trackError,
  } = useQuery<ITrack>({
    queryKey: ["track", id],
    queryFn: async () => {
      const foundTrack = tracks.find((t) => t._id === id);
      if (foundTrack) return foundTrack;
      const response = await api.get(`/api/tracks/${id}`);
      return response.data;
    },
    enabled: !contextLoading, // Ensure the query runs only after context data loads
  });

  // Fetch artist data with React Query
  const {
    data: artist,
    isLoading: artistLoading,
    error: artistError,
  } = useQuery<IArtist>({
    queryKey: ["artist", track?.artist],
    queryFn: async () => {
      const response = await api.get(`/api/artists/name/${track?.artist}`);
      return response.data;
    },
    enabled: !!track?.artist, // Run only if track data is available
  });

  // Get dominant color from album cover
  useEffect(() => {
    if (track?.albumCoverUrl) {
      getDominantColor(track.albumCoverUrl).then((color) => {
        setBackground(color);
      });
    }
  }, [track]);

  if (trackLoading || artistLoading) return <p>Loading track...</p>;
  if (trackError || artistError || contextError)
    return <p>Failed to load data</p>;
  if (!track) return <p>Track not found</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="min-h-screen w-full text-white">
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
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute bg-black w-[50px] h-[50px] rounded-full opacity-80"></div>
            <AiFillPlayCircle
              size={"65px"}
              color="#1ed760"
              className="relative"
            />
          </div>
          <button
            onClick={() => setAdded(!added)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="focus:outline-none"
          >
            {added ? (
              isHovered ? (
                <FaCheckCircle size={32} color="lime" />
              ) : (
                <FaCheckCircle size={32} color="LimeGreen" />
              )
            ) : isHovered ? (
              <BiPlusCircle size={32} color="white" />
            ) : (
              <BiPlusCircle size={32} color="darkgrey" />
            )}
          </button>
          <div className="text-white text-2xl cursor-pointer mb-3">&#8230;</div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <img
            src={artist.images?.[0]?.url || "/default-artist.jpg"}
            alt={track.name}
            className="w-[70px] h-[70px] object-cover rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-l font-bold">Artist</h1>
            <h1 className="text-l font-bold">{track.artist}</h1>
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
