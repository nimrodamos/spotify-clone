import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum, ITrack, IArtist } from "../../types/types";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { getDominantColor } from "@/lib/getDominantColor";

// Fetch album details by ID
const fetchAlbumById = async (id: string): Promise<IAlbum> => {
  const response = await api.get(`/api/albums/${id}`);
  const album = response.data;

  album.artist = album.artist
    .split(/,\s*/)
    .map((artist: string) => artist.trim());
  return album;
};

// Fetch artist details by name
const fetchArtistByName = async (artistNames: string[]): Promise<IArtist[]> => {
  const artistPromises = artistNames.map((artistName) =>
    api.get(`/api/artists/name/${encodeURIComponent(artistName)}`)
  );
  const responses = await Promise.all(artistPromises);
  return responses.map((response) => response.data);
};

// Fetch tracks by artist name
const fetchTracksByArtist = async (artistName: string): Promise<ITrack[]> => {
  const response = await api.get(
    `/api/tracks/artist/${encodeURIComponent(artistName)}`
  );
  return response.data;
};

const DisplayAlbum: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [background, setBackground] = useState<string>("#121212");
  const [added, setAdded] = useState<boolean>(false);

  // Fetch album details
  const {
    data: album,
    isLoading: loadingAlbum,
    error: albumError,
  } = useQuery({
    queryKey: ["album", id],
    queryFn: () => fetchAlbumById(id as string),
    enabled: Boolean(id),
  });

  // Fetch artist details
  const {
    data: artists,
    isLoading: loadingArtists,
    error: artistsError,
  } = useQuery({
    queryKey: [
      "artists",
      Array.isArray(album?.artist) ? album.artist.join(",") : "",
    ],
    queryFn: () =>
      fetchArtistByName(Array.isArray(album?.artist) ? album.artist : []),
    enabled: Boolean(album?.artist),
  });

  // Fetch album tracks
  const {
    data: tracks,
    isLoading: loadingTracks,
    error: tracksError,
  } = useQuery({
    queryKey: ["tracks", album?.artist],
    queryFn: () => fetchTracksByArtist(album?.artist?.[0] || ""),
    enabled: Boolean(album?.artist),
  });

  // Update background color based on album cover
  useEffect(() => {
    if (album?.albumCoverUrl) {
      getDominantColor(album.albumCoverUrl).then((color) =>
        setBackground(color)
      );
    }
  }, [album?.albumCoverUrl]);

  // Handle loading and error states
  if (loadingAlbum || loadingArtists || loadingTracks) {
    return <p className="text-center text-xl">Loading...</p>;
  }
  if (albumError || artistsError || tracksError) {
    return (
      <p className="text-center text-xl text-red-500">
        Failed to load album or artist data.
      </p>
    );
  }
  if (!album) return <p className="text-center text-xl">Album not found</p>;

  // Filter tracks by album name
  const filteredTracks =
    tracks?.filter((track) => track.album === album.name) || [];

  return (
    <div className="min-h-screen w-full">
      <div
        className="px-5"
        style={{
          background: `linear-gradient(to bottom, ${background}, #121212)`,
        }}
      >
        <div className="flex items-center">
          <img
            className="w-48 h-48 object-cover rounded-md shadow-md"
            src={album.albumCoverUrl}
            alt={album.name}
          />
          <div className="mx-3 mt-10">
            <span>Album</span>
            <h2
              style={{
                fontSize: `${Math.max(24, 60 - album.name.length)}px`,
              }}
              className="font-bold text-white mb-2"
            >
              {album.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              {artists?.map((artist) => (
                <div key={artist.name} className="flex items-center space-x-2">
                  {artist.images?.[0]?.url && (
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={artist.images[0].url}
                      alt={artist.name}
                    />
                  )}
                  <p className="text-lg text-gray-300">{artist.name}</p>
                </div>
              ))}
              <p className="text-sm text-gray-400">{album.releaseDate}</p>
              <p className="text-sm text-gray-400">{album.totalTracks} songs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-8 flex gap-4 items-center">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute bg-black w-[50px] h-[50px] rounded-full opacity-80"></div>
          <AiFillPlayCircle
            size={"65px"}
            color="#1ed760"
            className="relative"
          />
        </div>
        <button onClick={() => setAdded(!added)} className="focus:outline-none">
          {added ? (
            <FaCheckCircle size={32} color="LimeGreen" />
          ) : (
            <BiPlusCircle size={32} />
          )}
        </button>
        <div className="text-white text-2xl cursor-pointer">&#8230;</div>
      </div>

      <h3 className="font-semibold text-white m-4 mt-5"># title</h3>
      <div className="space-y-4">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => (
            <div
              key={track.spotifyTrackId}
              className="flex items-center space-x-4 ml-4 p-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
            >
              <div>
                <p className="text-l font-semibold text-white">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-400">
            No tracks available for this album.
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplayAlbum;
