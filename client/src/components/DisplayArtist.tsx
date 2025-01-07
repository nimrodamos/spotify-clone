import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  preview_url: string | null;
}

const DisplayArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext(); // קבלת המשתמש מה-Context
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopTracks() {
      try {
        if (!user || !user.accessToken) {
          throw new Error("No access token available");
        }

        const response = await axios.get(
          `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // שימוש בטוקן מה-Context
            },
          }
        );

        setTracks(response.data.tracks);
      } catch (err) {
        console.error("Error fetching top tracks:", err);
        setError("Failed to load top tracks. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTopTracks();
  }, [id, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="artist-item flex flex-col items-center p-4">
      <h3 className="text-lg font-semibold">Top Tracks</h3>
      <div className="w-full">
        {tracks.map((track) => (
          <div key={track.id} className="py-2 border-b border-gray-700">
            <p className="font-bold">{track.name}</p>
            <p className="text-sm text-gray-400">Album: {track.album.name}</p>
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-32 h-32 rounded mt-2"
            />
            {track.preview_url && (
              <audio controls className="mt-2">
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayArtist;
