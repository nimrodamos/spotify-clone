import React from "react";
import CardItem from "@/components/CardItem";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum } from "@/types/types";

// פונקציה לשליפת האלבומים
const fetchAlbums = async (): Promise<IAlbum[]> => {
  const response = await api.get("/api/albums/offset?offset=0&limit=50");
  return response.data;
};

const AllAlbums: React.FC = () => {
  // שליפת נתונים באמצעות React Query
  const {
    data: albums,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load albums</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {albums?.map((album) => (
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
