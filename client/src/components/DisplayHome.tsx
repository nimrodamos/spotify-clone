import { albumsData, songsData } from "@/assets/assets";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "@/api";

function DisplayHome() {
  interface Album {
    name: string;
    artist: string;
    image: string;
    releaseDate?: string;
  }

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await api.get("/api/albums");
        console.log("Albums fetched from API:", response.data); // Log the response to inspect the data structure
        setAlbums(response.data?.length ? response.data : []); // Handle missing or unexpected data gracefully
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  return (
    <>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured charts</h1>
        <div className="flex overflow-auto">
          {albumsData.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto">
          {songsData.map((item, index) => (
            <SongItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-auto">
          {loading ? (
            <p>Loading...</p>
          ) : Array.isArray(albums) && albums.length > 0 ? (
            albums.map((album, index) => (
              <AlbumItem
                key={index}
                name={album.name}
                desc={`By ${album.artist}`}
                id={index}
                image={album.image || "/path/to/default-placeholder.jpg"} // Provide a default placeholder image
              />
            ))
          ) : (
            <p>No albums found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default DisplayHome;
