import { useEffect, useState } from "react";
import { api } from "@/api";
import CardItem from "@/components/CardItem";
import { IArtist } from "@/types/types";

const AllArtists: React.FC = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await api.get("/api/artists");
        setArtists(response.data);
      } catch (err) {
        console.error("Error fetching artists:", err);
        setError("Failed to load artists. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchArtists();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {artists.map((artist) => (
        <CardItem
          key={artist._id}
          name={artist.name}
          desc={artist.genres.join(", ")}
          id={artist._id}
          image={artist.images[0]?.url || ""}
          type="artist"
        />
      ))}
    </div>
  );
};

export default AllArtists;
