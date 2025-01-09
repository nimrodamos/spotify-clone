import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { IArtist } from "@/types/types";
import { api } from "@/api";

const DisplayArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext(); // קבלת המשתמש מה-Context
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtist() {
      try {
        const response = await api.get(`/api/artists/${id}`);
        if (response.data) {
          setArtist(response.data); // קבלת נתוני האמן
        }
        console.log("Artist data:", response.data); // הדפסת נתוני האמן
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
    <div className="bg-black text-white">
      {/* Header Section */}
      <div
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${artist?.images?.[0]?.url})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Artist Info Section */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          {/* Artist Image */}
          <img
            src={artist?.images?.[0]?.url}
            alt={artist?.name}
            className="w-32 h-32 object-cover border-4 border-white rounded-full"
          />
          <div className="ml-6">
            <h2 className="text-4xl font-bold">{artist?.name}</h2>
            <p className="text-xl">
              {artist?.followers?.total} monthly listeners
            </p>
            <a
              href={artist?.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-green-500 hover:underline"
            >
              Listen on Spotify
            </a>
          </div>
        </div>

        {/* Genres Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Genres</h3>
          <p className="text-lg">{artist?.genres?.join(", ")}</p>
        </div>

        {/* Popular Tracks Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Popular Tracks</h3>
          <ul>
            {/* ניתן להוסיף את השירים הפופולריים כאן */}
            <li className="flex items-center mb-2">
              <p className="font-bold flex-1">name of song</p>
              <p className="text-sm">views</p>
            </li>
            <li className="flex items-center mb-2">
              <p className="font-bold flex-1">name of song</p>
              <p className="text-sm">views</p>
            </li>
            <li className="flex items-center mb-2">
              <p className="font-bold flex-1">name of song</p>
              <p className="text-sm">views</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisplayArtist;
