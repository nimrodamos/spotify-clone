import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";

const fetchNewReleases = async (accessToken: string) => {
  const response = await api.get(
    "https://api.spotify.com/v1/browse/new-releases?limit=2",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.albums.items;
};

const WhatsNew: React.FC = () => {
  const { user } = useUserContext();

  const {
    data: songs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["newReleases"],
    queryFn: () => fetchNewReleases(user?.accessToken as string),
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading) {
    return <p className="text-white text-center">Loading new releases...</p>;
  }

  if (error || !songs) {
    return (
      <p className="text-red-500 text-center">Failed to load new releases</p>
    );
  }

  return (
    <div className="px-12 py-10 text-white">
      <h1 className="text-4xl font-bold mb-2">What's New</h1>
      <p className="text-gray-400 mb-6">
        The latest releases from artists, podcasts, and shows you follow.
      </p>
      <div className="flex gap-4 mb-6">
        <button className="bg-gray-700 text-white py-2 px-4 rounded-full focus:outline-none">
          Music
        </button>
        <button className="bg-gray-700 text-white py-2 px-4 rounded-full focus:outline-none">
          Podcast & Shows
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">New</h2>
      {songs.map((song: any) => (
        <div key={song.id} className="border-t border-gray-600 pt-4">
          <div className="flex items-center gap-4">
            <img
              src={song.images[0]?.url || "/default-image.jpg"}
              alt={song.name}
              className="w-20 h-20 rounded-lg"
            />
            <div>
              <p className="text-lg font-bold">{song.name}</p>
              <p className="text-gray-400">{song.artists[0]?.name}</p>
              <p className="text-gray-400">
                Album • {new Date(song.release_date).toDateString()}
              </p>
            </div>
            <button className="ml-auto text-white text-2xl">▶</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhatsNew;
