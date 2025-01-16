import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/api";
import { IAlbum, ITrack, IArtist } from "../../types/types";
import { useAppData } from "@/Context/AppDataContext";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { getDominantColor } from "@/lib/getDominantColor";

const DisplayAlbum: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { albums, loading: contextLoading, error: contextError } = useAppData();
  const [album, setAlbum] = useState<IAlbum | null>(null);
  const [artist, setArtist] = useState<IArtist | null>(null); // State for artist data
  const [filteredTracks, setFilteredTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<boolean>(false);
  const [background, setBackground] = useState<string>("#121212");

  useEffect(() => {
    async function fetchAlbumAndArtist() {
      try {
        setLoading(true);

        // Fetch album from context or API
        const albumFromContext = albums.find((a) => a.spotifyAlbumId === id);
        let currentAlbum = albumFromContext;

        if (!albumFromContext) {
          const albumResponse = await api.get(`/api/albums/${id}`);
          currentAlbum = albumResponse.data;
        }

        setAlbum(currentAlbum || null);

        // Fetch artist data
        if (currentAlbum) {
          const artistResponse = await api.get(
            `/api/artists/name/${encodeURIComponent(currentAlbum.artist)}`
          );
          setArtist(artistResponse.data);

          // Fetch tracks for the album
          const tracksResponse = await api.get(`/api/tracks`);
          const albumTracks = tracksResponse.data.filter(
            (track: ITrack) => track.album === currentAlbum.name
          );
          setFilteredTracks(albumTracks);
        } else {
          setFilteredTracks([]);
        }
      } catch (err) {
        setError("Failed to load album or artist data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumAndArtist();
  }, [id, albums]);

  useEffect(() => {
    if (album?.albumCoverUrl) {
      getDominantColor(album.albumCoverUrl).then((color) => {
        setBackground(color);
      });
    }
  }, [album]);

  if (contextLoading || loading)
    return <p className="text-center text-xl">Loading...</p>;
  if (contextError || error)
    return (
      <p className="text-center text-xl text-red-500">
        {contextError || error}
      </p>
    );
  if (!album) return <p className="text-center text-xl">Album not found</p>;

  return (
    <div className="max-w-screen-lg mx-auto">
      <div
        className="p-5"
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
          <div className="m-5">
            <span>Album</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {album.name}
            </h2>
            <div className="flex items-center space-x-4">
              {artist?.images?.[0]?.url && (
                <img
                  className="w-12 h-12 object-cover rounded-full"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
              )}
              <p className="text-lg text-gray-300">{album.artist}</p>
              <p className="text-sm text-gray-400">{album.releaseDate}</p>
              <p className="text-sm text-gray-400">{album.totalTracks} songs</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-8 flex gap-4 items-center ">
        <AiFillPlayCircle size={70} color="LimeGreen" />
        <button onClick={() => setAdded(!added)} className="focus:outline-none">
          {added ? (
            <FaCheckCircle size={32} color="LimeGreen" />
          ) : (
            <BiPlusCircle size={32} />
          )}
        </button>
        <div className="text-white text-2xl cursor-pointer">&#8230;</div>
      </div>

      <h3 className=" font-semibold text-white m-4 mt-5"># title</h3>
      <div className="space-y-4">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => (
            <div
              key={track.spotifyTrackId}
              className="flex items-center  space-x-4 ml-4 p-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
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
