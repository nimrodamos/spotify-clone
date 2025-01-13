import React from "react";
import CardItem from "@/components/CardItem";
import { useAppData } from "@/Context/AppDataContext"; // שימוש ב-Context

const AllArtists: React.FC = () => {
  const { artists, loading, error } = useAppData(); // נתוני אמנים מה-Context

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
