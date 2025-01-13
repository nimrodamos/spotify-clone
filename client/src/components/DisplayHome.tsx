import React from "react";
import { useAppData } from "@/Context/AppDataContext";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import CarouselArtists from "./Artists/CarouselArtists";
import CarouselAlbums from "./Albums/CarouselAlbums";
import FilterButtons from "./FilterButtons";
import PersonalizedPlaylists from "./Playlists/PersonalizedPlaylists";

const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-blue-500 hover:underline text-sm mb-2"
  >
    Show All
  </button>
);

const DisplayHome: React.FC = () => {
  const { user } = useUserContext();
  const { albums, playlists, artists, loading, error } = useAppData();
  const navigate = useNavigate();

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
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mb-4 px-6 pt-4 display-home">
      <FilterButtons filter={filter} setFilter={setFilter} />

      {user && (
        <>
          <h1 className="my-5 font-bold text-2xl">
            Made for {user.displayName}
          </h1>
          <PersonalizedPlaylists playlists={filteredPlaylists} />
        </>
      )}

      <h1 className="my-5 font-bold text-2xl">Popular Artists</h1>
      <ShowAllButton onClick={() => navigate("/artists")} />
      <CarouselArtists artists={filteredArtists} />

      <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
      <ShowAllButton onClick={() => navigate("/albums")} />
      <CarouselAlbums albums={filteredAlbums} />
    </div>
  );
};

export default DisplayHome;
