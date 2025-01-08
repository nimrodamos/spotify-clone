import { useEffect, useState } from "react";
import { api } from "@/api";
import CardItem from "@/components/CardItem";
import { IPlaylist } from "@/types/types";

const AllPlaylists: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await api.get("/api/playlists");
        setPlaylists(response.data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {playlists.map((playlist) => (
        <CardItem
          key={playlist._id}
          name={playlist.PlaylistTitle}
          desc={playlist.description}
          id={playlist._id}
          image={playlist.customAlbumCover || ""}
          type="playlist"
        />
      ))}
    </div>
  );
};

export default AllPlaylists;
