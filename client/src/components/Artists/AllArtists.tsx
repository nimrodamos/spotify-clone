import React, { useEffect } from "react";
import CardItem from "@/components/CardItem";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IArtist } from "@/types/types";

// פונקציה לשליפת האמנים עם בדיקת מבנה הנתונים
const fetchArtists = async (): Promise<{
  data: IArtist[];
  total: number;
  hasMore: boolean;
}> => {
  const response = await api.get("/api/artists/offset?offset=0&limit=50");
  return response.data;
};

const AllArtists: React.FC = () => {
  // שליפת נתונים באמצעות React Query עם מבנה מותאם
  const {
    data: artistsResponse = { data: [], total: 0, hasMore: false },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["artists"],
    queryFn: fetchArtists,
  });

  // חילוץ הנתונים מתוך האובייקט
  const artists = artistsResponse.data || [];

  useEffect(() => {
    console.log("Fetched artists:", artistsResponse);
    if (artists.length > 0) {
      console.log("First artist:", artists[0]);
    }
  }, [artistsResponse]);

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error) {
    console.error("Error loading artists:", error);
    return <p className="text-center text-red-500">Failed to load artists</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
      {Array.isArray(artists) && artists.length > 0 ? (
        artists.map((artist) =>
          artist?._id && artist?.name ? (
            <CardItem
              key={artist._id}
              name={artist.name}
              desc={artist.genres?.join(", ") || "Unknown Genre"}
              id={artist._id}
              image={artist.images?.[0]?.url || "/default-artist.jpg"}
              type="artist"
            />
          ) : null
        )
      ) : (
        <p className="text-center text-gray-400">No artists available</p>
      )}
    </div>
  );
};

export default AllArtists;
