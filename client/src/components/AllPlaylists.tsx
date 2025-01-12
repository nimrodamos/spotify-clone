import React from "react";
import CardItem from "@/components/CardItem";
import { useAppData } from "@/Context/AppDataContext"; // שימוש ב-Context

const AllPlaylists: React.FC = () => {
  const { playlists, loading, error } = useAppData(); // נתוני פלייליסטים מה-Context

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
