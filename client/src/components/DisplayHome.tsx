import { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { api } from "@/api";
import { IAlbum, IPlaylist, IArtist } from "../types/types";
import { useUserContext } from "@/Context/UserContext";

// Utility function to shuffle an array
const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const DisplayHome: React.FC = () => {
  const { user, setUser } = useUserContext(); // Access UserContext
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<IAlbum[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<IPlaylist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<IArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "music" | "podcast">("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [albumsResponse, playlistsResponse, artistsResponse] =
          await Promise.all([
            api.get("/api/albums"),
            api.get("/api/playlists"),
            api.get("/api/artists"),
          ]);

        const shuffledAlbums = shuffleArray(albumsResponse.data).slice(0, 7); // Shuffle and limit to 7 albums
        setAlbums(shuffledAlbums);
        setPlaylists(playlistsResponse.data.slice(0, 7)); // Limit to 7 playlists
        setArtists(shuffleArray(artistsResponse.data.slice(0, 7))); // Shuffle and limit to 7 artists
        setFilteredAlbums(shuffledAlbums);
        setFilteredPlaylists(playlistsResponse.data.slice(0, 7));
        setFilteredArtists(shuffleArray(artistsResponse.data.slice(0, 7))); // Shuffle and limit to 7 artists
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Filter logic
    if (filter === "all") {
      setFilteredAlbums(albums);
      setFilteredPlaylists(playlists);
      setFilteredArtists(artists);
    } else if (filter === "music") {
      setFilteredAlbums(
        albums.filter((album) => album.genres.includes("music"))
      );
      setFilteredPlaylists(
        playlists.filter((playlist) => playlist.type === "music")
      );
      setFilteredArtists(artists); // Assuming all artists are music-related
    } else if (filter === "podcast") {
      setFilteredAlbums([]); // No albums in podcasts
      setFilteredPlaylists(
        playlists.filter((playlist) => playlist.type === "podcast")
      );
      setFilteredArtists([]); // No artists in podcasts
    }
  }, [filter, albums, playlists, artists]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-4">
      {/* Filter Buttons */}
      <div className="flex gap-4 my-4">
        <button
          className={`py-2 px-4 rounded-full ${
            filter === "all"
              ? "bg-white text-black"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`py-2 px-4 rounded-full ${
            filter === "music"
              ? "bg-white text-black"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("music")}
        >
          Music
        </button>
        <button
          className={`py-2 px-4 rounded-full ${
            filter === "podcast"
              ? "bg-white text-black"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setFilter("podcast")}
        >
          Podcasts
        </button>
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
      <button
        className="ml-4 text-blue-500"
        onClick={() => (window.location.href = "/artists")}
      >
        Show All
      </button>
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
      <button
        className="ml-4 text-blue-500"
        onClick={() => (window.location.href = "/albums")}
      >
        Show All
      </button>
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
