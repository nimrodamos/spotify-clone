import React from "react";
import CardItem from "@/components/CardItem";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IArtist } from "@/types/types";

// פונקציה לשליפת האמנים
const fetchArtists = async (): Promise<IArtist[]> => {
  const response = await api.get("/api/artists/offset?offset=0&limit=50");
  return response.data;
};

const AllArtists: React.FC = () => {
  // שליפת נתונים באמצעות React Query
  const {
    data: artists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
  });

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load artists</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {artists?.map((artist) => (
        <CardItem
          key={artist._id}
          name={artist.name}
          desc={artist.genres?.join(", ") || "Unknown Genre"}
          id={artist._id}
          image={artist.images?.[0]?.url || "/default-artist.jpg"}
          type="artist"
        />
      ))}
    </div>
  );
};

export default AllArtists;
