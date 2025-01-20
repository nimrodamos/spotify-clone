import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import CardItem from "./CardItem";

const fetchWhatsNew = async (accessToken: string) => {
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
    data: whatsNew,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["whatsNew"],
    queryFn: () => fetchWhatsNew(user?.accessToken as string),
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading) {
    return <p className="text-center text-gray-400">Loading what's new...</p>;
  }

  if (error || !whatsNew) {
    return (
      <p className="text-center text-red-500">Failed to load what's new</p>
    );
  }

  return (
    <div className="flex overflow-auto scrollbar-hide">
      {whatsNew.map((album: any, index: number) => (
        <CardItem
          key={`${album.id || "newAlbum"}-${index}`} // Ensure unique keys by appending the index
          name={album.name}
          desc={album.artists.map((artist: any) => artist.name).join(", ")}
          id={album.id}
          image={album.images[0]?.url || "/default-image.jpg"}
          type="album"
        />
      ))}
    </div>
  );
};

export default CarouselWhatsNew;
