import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import CardItem from "./CardItem";

const fetchTopTracks = async (accessToken: string) => {
  const response = await api.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.items;
};

const CarouselTopTracks: React.FC = () => {
  const { user } = useUserContext();

  const {
    data: topTracks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topTracks"],
    queryFn: () => fetchTopTracks(user?.accessToken as string),
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading) {
    return <p className="text-center text-gray-400">Loading top tracks...</p>;
  }

  if (error || !topTracks) {
    return (
      <p className="text-center text-red-500">Failed to load top tracks</p>
    );
  }

  return (
    <div className="flex overflow-auto scrollbar-hide">
      {topTracks.map((track: any, index: number) => (
        <CardItem
          key={`${track.id || "topTrack"}-${index}`} // Ensure unique keys by appending the index
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

export default CarouselTopTracks;
