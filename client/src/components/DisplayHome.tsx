// Refactored DisplayHome.tsx
import { useEffect, useState } from "react";
import AlbumItem from "./AlbumItem";
import { api } from "@/api";
import { IAlbum } from "../types/types";

const DisplayHome: React.FC = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await api.get("/api/albums");
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setError("Failed to fetch albums. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-4">
      <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
      <div className="flex overflow-auto">
        {albums.map((album) => (
          <AlbumItem
            key={album._id}
            name={album.name}
            desc={album.artist}
            id={album._id}
            image={album.albumCoverUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayHome;
