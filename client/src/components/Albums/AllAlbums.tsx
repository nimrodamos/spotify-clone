import React, { useEffect } from "react";
import CardItem from "@/components/CardItem";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum } from "@/types/types";

const fetchAlbums = async (): Promise<{
  data: IAlbum[];
  total: number;
  hasMore: boolean;
}> => {
  const response = await api.get("/api/albums/offset?offset=0&limit=20");
  return response.data;
};

const AllAlbums: React.FC = () => {
  const {
    data: albumsResponse = { data: [], total: 0, hasMore: false },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  const albums = albumsResponse.data || [];

  useEffect(() => {
    console.log("Fetched albums:", albumsResponse);
    if (albums.length > 0) {
      console.log("First album:", albums[0]);
    }
  }, [albumsResponse]);

  if (isLoading) return <p className="text-center text-white">Loading...</p>;
  if (error) {
    console.error("Error loading albums:", error);
    return <p className="text-center text-red-500">Failed to load albums</p>;
  }

  return (
    <div className="px-12 py-10">
      <h1 className="text-white text-4xl font-bold mb-6">All Albums</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.isArray(albums) && albums.length > 0 ? (
          albums.map((album) =>
            album?.spotifyAlbumId && album?.name ? (
              <CardItem
                key={album.spotifyAlbumId}
                name={album.name}
                desc={album.artist || "Unknown Artist"}
                id={album.spotifyAlbumId}
                image={album.albumCoverUrl || "/default-album.jpg"}
                type="album"
              />
            ) : null
          )
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No albums available
          </p>
        )}
      </div>
    </div>
  );
};

export default AllAlbums;
