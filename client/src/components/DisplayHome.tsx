import React from "react";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import CarouselArtists from "./Artists/CarouselArtists";
import CarouselAlbums from "./Albums/CarouselAlbums";
import FilterButtons from "./FilterButtons";
import PersonalizedPlaylists from "./Playlists/PersonalizedPlaylists";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum, IArtist, IPlaylist } from "@/types/types";

// כפתור "Show All" להצגת כל הפריטים
const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="hover:underline text-sm mb-2">
    Show All
  </button>
);

// פונקציות לקבלת נתונים מהשרת
const fetchAlbums = async (): Promise<IAlbum[]> => {
  const response = await api.get("/api/albums/offset?offset=0&limit=20");
  return response.data;
};

const fetchArtists = async (): Promise<IArtist[]> => {
  const response = await api.get("/api/artists/offset?offset=0&limit=20");
  return response.data;
};

const fetchPlaylists = async (): Promise<IPlaylist[]> => {
  const response = await api.get("/api/playlists");
  return response.data;
};

const DisplayHome: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  // שליפת נתונים באמצעות React Query
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

  // חישוב מצבי טעינה ושגיאות
  const loading = loadingAlbums || loadingArtists || loadingPlaylists;
  const error = albumsError || artistsError || playlistsError;

  // ניהול מצב סינון
  const [filter, setFilter] = React.useState<"all" | "music" | "podcast">(
    "all"
  );

  const filteredAlbums = React.useMemo(() => {
    if (filter === "music")
      return albums.filter((album) => album.genres.includes("music"));
    if (filter === "podcast") return [];
    return albums;
  }, [filter, albums]);

  const filteredArtists = React.useMemo(() => {
    if (filter === "podcast") return [];
    return artists;
  }, [filter, artists]);

  const filteredPlaylists = React.useMemo(() => {
    if (filter === "music")
      return playlists.filter((playlist) => playlist.type === "music");
    if (filter === "podcast")
      return playlists.filter((playlist) => playlist.type === "podcast");
    return playlists;
  }, [filter, playlists]);

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
            <PersonalizedPlaylists playlists={filteredPlaylists} />
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
        <CarouselArtists artists={filteredArtists} />

        <div className="flex justify-between items-center px-4 mb-4">
          <h1
            className="font-bold text-2xl cursor-pointer hover:underline"
            onClick={() => navigate("/albums")}
          >
            Featured Albums
          </h1>
          <ShowAllButton onClick={() => navigate("/albums")} />
        </div>
        <CarouselAlbums albums={filteredAlbums} />
      </div>
    </div>
  );
};

export default DisplayHome;
