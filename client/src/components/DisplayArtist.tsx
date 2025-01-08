import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";
import { IArtist } from "@/types/types";

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
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtist() {
      try {
        const response = await axios.get(`/api/artists/${id}`);

        if (response.data) {
          setArtist(response.data.artist); // קבלת נתוני האמן
          setTracks(response.data.tracks); // קבלת רשימת השירים של האמן
        }
        console.log("Artist data:", response.data); // הדפסת נתוני האמן
        console.log("Artist tracks:", response.data.tracks); // הדפסת השירים
      } catch (err) {
        console.error("Error fetching artist:", err);
        setError("Failed to load artist. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchArtist();
  }, [id]);

  if (!user) return <p>Please log in to view this content.</p>;
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
