import React from "react";
import CardItem from "./CardItem";
import { useAppData } from "@/Context/AppDataContext";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";

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

  const filteredPlaylists = React.useMemo(() => {
    if (filter === "music")
      return playlists.filter((playlist) => playlist.type === "music");
    if (filter === "podcast")
      return playlists.filter((playlist) => playlist.type === "podcast");
    return playlists;
  }, [filter, playlists]);

  const filteredArtists = React.useMemo(() => {
    if (filter === "podcast") return [];
    return artists;
  }, [filter, artists]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-4 px-6 pt-4">
      {/* Filter Buttons */}
      <div className="flex gap-4 my-4">
        {["all", "music", "podcast"].map((type) => (
          <button
            key={type}
            className={`py-2 px-4 rounded-full ${
              filter === type
                ? "bg-white text-black"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setFilter(type as "all" | "music" | "podcast")}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Show personalized section if user is logged in */}
      {user && (
        <>
          <h1 className="my-5 font-bold text-2xl">
            Made for {user.displayName}
          </h1>
          <div className="flex overflow-auto">
            {filteredPlaylists.map((playlist) => (
              <CardItem
                key={playlist._id}
                name={playlist.PlaylistTitle}
                desc={playlist.description}
                id={playlist._id}
                image={playlist.customAlbumCover || ""}
                type="playlist"
              />
            ))}
          </div>
        </>
      )}

      {/* Artists Section */}
      <h1 className="my-5 font-bold text-2xl">Popular Artists</h1>
      <button onClick={() => navigate("/artists")}>Show All</button>
      <div className="flex overflow-auto">
        {filteredArtists.map((artist) => (
          <CardItem
            key={artist._id}
            name={artist.name}
            desc={artist.genres.join(", ")}
            id={artist._id}
            image={artist.images[0]?.url || ""}
            type="artist"
          />
        ))}
      </div>

      {/* Albums Section */}
      <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
      <button onClick={() => navigate("/albums")}>Show All</button>
      <div className="flex overflow-auto">
        {filteredAlbums.map((album) => (
          <CardItem
            key={album.spotifyAlbumId}
            name={album.name}
            desc={album.artist}
            id={album.spotifyAlbumId}
            image={album.albumCoverUrl}
            type="album"
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayHome;
