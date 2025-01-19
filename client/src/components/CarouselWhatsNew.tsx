import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import CardItem from "./CardItem";

const fetchNewReleases = async (accessToken: string) => {
  const response = await api.get(
    "https://api.spotify.com/v1/browse/new-releases?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.albums.items;
};

const CarouselWhatsNew: React.FC = () => {
  const { user } = useUserContext();

  const {
    data: newReleases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["newReleases"],
    queryFn: () => fetchNewReleases(user?.accessToken as string),
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading) {
    return <p className="text-center text-gray-400">Loading new releases...</p>;
  }

  if (error || !newReleases) {
    return (
      <p className="text-center text-red-500">Failed to load new releases</p>
    );
  }

  return (
    <div className="flex overflow-auto scrollbar-hide gap-4">
      {newReleases.map((release: any) => (
        <CardItem
          key={release.id}
          name={release.name}
          desc={release.artists.map((artist: any) => artist.name).join(", ")}
          id={release.id}
          image={release.images[0]?.url || "/default-image.jpg"}
          type="album"
        />
      ))}
    </div>
  );
};

export default CarouselWhatsNew;
