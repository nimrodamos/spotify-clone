import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { ITrack, IArtist } from "@/types/types";
import { api } from "@/api";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AiFillPlayCircle } from "react-icons/ai";
import { getDominantColor } from "@/lib/getDominantColor"; // ייבוא הפונקציה שלנו

const DisplayArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    artists,
    loading: contextLoading,
    error: contextError,
  } = useAppData();
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] =
    useState<string>("rgb(0, 0, 0)");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const foundArtist = artists.find((a) => a._id === id);
        if (foundArtist) {
          setArtist(foundArtist);
        } else {
          const response = await api.get(`/api/artists/${id}`);
          setArtist(response.data);
        }
      } catch (err) {
        setError("Failed to fetch artist data");
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchArtist();
    }
  }, [id, artists, contextLoading]);

  useEffect(() => {
    if (artist?.images?.[0]?.url) {
      getDominantColor(artist.images[0].url)
        .then((color) => setBackgroundColor(color))
        .catch((err) =>
          console.error("Failed to extract dominant color:", err)
        );
    }
  }, [artist]);

  useEffect(() => {
    if (artist) {
      api
        .get(`/api/tracks/artist/${artist.name}`)
        .then((response) => setTracks(response.data))
        .catch(() => console.error("Failed to fetch tracks for this artist."));
    }
  }, [artist]);

  if (loading) return <p>Loading artist...</p>;
  if (error || contextError) return <p>{error || contextError}</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="bg-black text-white">
      {/* Artist Image */}
      <div>
        <img
          src={artist.images?.[0]?.url}
          alt={artist.name}
          className="w-full h-[300px] object-cover"
        />
      </div>

      {/* Background with Dynamic Gradient */}
      <div
        className="p-6"
        style={{
          background: `linear-gradient(to bottom, ${backgroundColor}, #121212)`,
        }}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <VscVerifiedFilled size={"25px"} color="DeepSkyBlue" />
            Verified Artist
          </div>
          <h2 className="text-7xl font-bold">{artist.name}</h2>
          <p className="text-l pt-2">
            {artist.followers.total.toLocaleString()} monthly listeners
          </p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <AiFillPlayCircle size={"70px"} color="LimeGreen" />
          <button className="bg-transparent text-white border border-white py-1 px-4 rounded-full hover:bg-white hover:text-black transition">
            Follow
          </button>
          <div className="text-white text-2xl cursor-pointer">&#8230;</div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Popular Tracks</h3>
        <ul>
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <li
                key={track.spotifyTrackId}
                className="flex items-center mb-2 cursor-pointer"
                onClick={() => navigate(`/track/${track.spotifyTrackId}`)}
              >
                <p className="font-bold mr-4">{index + 1}</p>
                <img
                  src={track.albumCoverUrl}
                  alt={track.name}
                  className="w-12 h-12 mr-4"
                />
                <p className="flex-1">{track.name}</p>
                <p>{(track.durationMs / 60000).toFixed(2)}</p>
              </li>
            ))
          ) : (
            <p>No tracks found for this artist.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DisplayArtist;
