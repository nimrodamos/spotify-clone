import { useEffect, useState } from "react";
import { api } from "@/api";
import CardItem from "@/components/CardItem";
import { IAlbum } from "@/types/types";

const AllAlbums: React.FC = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await api.get("/api/albums");
        setAlbums(response.data);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setError("Failed to load albums. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {albums.map((album) => (
        <CardItem
          key={album.spotifyAlbumId}
          name={album.name}
          desc={album.artist}
          id={album.spotifyAlbumId}
          image={album.albumCoverUrl}
          type="album"
        />
      ))}
    </div>
  );
};

export default AllAlbums;
