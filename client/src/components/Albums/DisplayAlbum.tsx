import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/api";
import { IAlbum, ITrack } from "../../types/types";
import { useAppData } from "@/Context/AppDataContext"; // שימוש ב-Context

const DisplayAlbum: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // מזהה האלבום
  const { albums, loading: contextLoading, error: contextError } = useAppData(); // נתונים מה-Context
  const [album, setAlbum] = useState<IAlbum | null>(null);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<ITrack[]>([]); // שירים שמתאימים לאלבום הנבחר
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        // שליפת נתוני האלבום מ-Context
        const albumFromContext = albums.find((a) => a.spotifyAlbumId === id);
        if (albumFromContext) {
          setAlbum(albumFromContext);
        } else {
          // אם האלבום לא נמצא בקונטקסט, שליפתו מה-API
          const albumResponse = await api.get(`/api/albums/${id}`);
          setAlbum(albumResponse.data);
        }

        // שליפת כל השירים
        const tracksResponse = await api.get(`/api/tracks`);
        setTracks(tracksResponse.data);

        // חיפוש שירים שמתאימים לאלבום
        const albumTracks = tracksResponse.data.filter(
          (track: ITrack) => track.album === (albumFromContext?.name || "")
        );
        setFilteredTracks(albumTracks);
      } catch (err) {
        setError("Failed to load album or tracks.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumData();
  }, [id, albums]);

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
    <div className="max-w-screen-lg mx-auto p-5">
      <div className="flex items-center justify-between mb-8">
        <img
          className="w-32 h-32 object-cover rounded-md shadow-md"
          src={album.albumCoverUrl}
          alt={album.name}
        />
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {album.name}
          </h2>
          <p className="text-lg text-gray-600">Artist: {album.artist}</p>
          <p className="text-sm text-gray-500">
            Release Date: {album.releaseDate}
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Track List</h3>
      <div className="space-y-4">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => (
            <div
              key={track.spotifyTrackId}
              className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
            >
              <img
                className="w-16 h-16 object-cover rounded-md"
                src={track.albumCoverUrl}
                alt={track.name}
              />
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {track.name}
                </p>
                <p className="text-sm text-gray-500">{track.artist}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500">
            No tracks available for this album.
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplayAlbum;
