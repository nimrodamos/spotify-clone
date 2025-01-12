import React from "react";
import CardItem from "@/components/CardItem";
import { useAppData } from "@/Context/AppDataContext"; // שימוש ב-Context

const AllAlbums: React.FC = () => {
  const { albums, loading, error } = useAppData(); // נתוני אלבומים מה-Context

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
