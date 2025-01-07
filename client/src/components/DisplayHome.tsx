// Updated DisplayHome.tsx to include dynamic navigation for playlists, artists, and albums

import { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { api } from "@/api";
import { IAlbum, IPlaylist, IArtist } from "../types/types";
import { Button } from "./ui/button";

const DisplayHome: React.FC = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [albumsResponse, playlistsResponse, artistsResponse] =
          await Promise.all([
            api.get("/api/albums"),
            api.get("/api/playlists"),
            api.get("/api/artists"),
          ]);

        setAlbums(albumsResponse.data.slice(0, 7)); // Limit to 7 albums
        setPlaylists(playlistsResponse.data.slice(0, 7)); // Limit to 7 playlists
        setArtists(artistsResponse.data.slice(0, 7)); // Limit to 7 artists
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-4">
      <h1 className="my-5 font-bold text-2xl">Playlists</h1>

      <button
        className="ml-4 text-blue-500"
        onClick={() => (window.location.href = "/playlists")}
      >
        Show All
      </button>
      <div className="flex overflow-auto">
        {playlists.map((playlist) => (
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

      <h1 className="my-5 font-bold text-2xl">Popular Artists</h1>
      <button
        className="ml-4 text-blue-500"
        onClick={() => (window.location.href = "/artists")}
      >
        Show All
      </button>
      <div className="flex overflow-auto">
        {artists.map((artist) => (
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

      <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
      <button
        className="ml-4 text-blue-500"
        onClick={() => (window.location.href = "/albums")}
      >
        Show All
      </button>
      <div className="flex overflow-auto">
        {albums.map((album) => (
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
