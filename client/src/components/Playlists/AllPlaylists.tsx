import React from "react";
import CardItem from "@/components/CardItem";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IPlaylist } from "@/types/types";

const fetchPlaylists = async (): Promise<IPlaylist[]> => {
  const response = await api.get("/api/playlists");
  return response.data;
};

const AllPlaylists: React.FC = () => {
  const {
    data: playlists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
  });

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load playlists</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {playlists?.map((playlist) => (
        <CardItem
          key={playlist._id}
          name={playlist.PlaylistTitle}
          desc={playlist.description || "No description available"}
          id={playlist._id}
          image={playlist.customAlbumCover || "/default-playlist.jpg"}
          type="playlist"
        />
      ))}
    </div>
  );
};

export default AllPlaylists;
