import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import CardItem from "./CardItem";

const fetchRecentlyPlayed = async (accessToken: string) => {
  const response = await api.get(
    "https://api.spotify.com/v1/me/player/recently-played?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.items.map((item: any) => item.track);
};

const CarouselRecentlyPlayed: React.FC = () => {
  const { user } = useUserContext();

  const {
    data: recentlyPlayed,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentlyPlayed"],
    queryFn: () => fetchRecentlyPlayed(user?.accessToken as string),
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading) {
    return (
      <p className="text-center text-gray-400">Loading recently played...</p>
    );
  }

  if (error || !recentlyPlayed) {
    return (
      <p className="text-center text-red-500">
        Failed to load recently played tracks
      </p>
    );
  }

  return (
    <div className="flex overflow-auto scrollbar-hide">
      {recentlyPlayed.map((track: any, index: number) => (
        <CardItem
          key={`${track.id || "track"}-${index}`} // Ensure unique keys by appending the index
          name={track.name}
          desc={track.artists.map((artist: any) => artist.name).join(", ")}
          id={track.id}
          image={track.album.images[0]?.url || "/default-image.jpg"}
          type="track"
        />
      ))}
    </div>
  );
};

export default CarouselRecentlyPlayed;
