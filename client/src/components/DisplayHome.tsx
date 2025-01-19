import React, { useEffect } from "react";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import CarouselArtists from "./Artists/CarouselArtists";
import CarouselAlbums from "./Albums/CarouselAlbums";
import FilterButtons from "./FilterButtons";
import PersonalizedPlaylists from "./Playlists/PersonalizedPlaylists";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum } from "@/types/types";

const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="hover:underline text-sm mb-2">
    Show All
  </button>
);

const fetchAlbums = async () => {
  const response = await api.get("/api/albums/offset?offset=0&limit=20");
  return response.data;
};

const fetchArtists = async () => {
  const response = await api.get("/api/artists/offset?offset=0&limit=20");
  return response.data;
};

const fetchPlaylists = async () => {
  const response = await api.get("/api/playlists");
  return response.data;
};

const DisplayHome: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const {
    data: albums = [],
    isLoading: loadingAlbums,
    error: albumsError,
  } = useQuery({ queryKey: ["albums"], queryFn: fetchAlbums });

  const {
    data: artists = [],
    isLoading: loadingArtists,
    error: artistsError,
  } = useQuery({ queryKey: ["artists"], queryFn: fetchArtists });

  const {
    data: playlists = [],
    isLoading: loadingPlaylists,
    error: playlistsError,
  } = useQuery({ queryKey: ["playlists"], queryFn: fetchPlaylists });

  useEffect(() => {
    console.log("Fetched albums:", albums);
    console.log("Fetched artists:", artists);
    console.log("Fetched playlists:", playlists);
  }, [albums, artists, playlists]);

  const loading = loadingAlbums || loadingArtists || loadingPlaylists;
  const error = albumsError || artistsError || playlistsError;

  const [filter, setFilter] = React.useState<"all" | "music" | "podcast">(
    "all"
  );

  const filteredAlbums = React.useMemo(() => {
    if (!albums?.data || !Array.isArray(albums.data)) return [];
    if (filter === "music")
      return albums.data.filter((album: IAlbum) =>
        album.genres?.includes("music")
      );
    if (filter === "podcast") return [];
    return albums.data;
  }, [filter, albums]);

  useEffect(() => {
    console.log("Filtered albums:", filteredAlbums);
  }, [filteredAlbums]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Failed to load data</div>;

  return (
    <div className="min-h-full w-full">
      <div className="bg-gradient-to-b from-[#141b14] via-backgroundBase/100 to-backgroundBase w-full p-4">
        {user && <FilterButtons filter={filter} setFilter={setFilter} />}

        {user && (
          <div className="mb-8">
            <h1 className="px-4 my-5 font-bold text-2xl">
              Made for {user.displayName}
            </h1>
            <PersonalizedPlaylists playlists={playlists} />
          </div>
        )}

        <div className="flex justify-between items-center px-4 mb-4">
          <h1
            className="font-bold text-2xl cursor-pointer hover:underline"
            onClick={() => navigate("/artists")}
          >
            Popular Artists
          </h1>
          <ShowAllButton onClick={() => navigate("/artists")} />
        </div>
        {Array.isArray(artists) && artists.length > 0 ? (
          <CarouselArtists artists={artists} />
        ) : (
          <p className="text-center text-gray-400">No artists available</p>
        )}

        <div className="flex justify-between items-center px-4 mb-4">
          <h1
            className="font-bold text-2xl cursor-pointer hover:underline"
            onClick={() => navigate("/albums")}
          >
            Featured Albums
          </h1>
          <ShowAllButton onClick={() => navigate("/albums")} />
        </div>
        {Array.isArray(filteredAlbums) && filteredAlbums.length > 0 ? (
          <CarouselAlbums albums={filteredAlbums} />
        ) : (
          <p className="text-center text-gray-400">No albums available</p>
        )}
      </div>
    </div>
  );
};

export default DisplayHome;
