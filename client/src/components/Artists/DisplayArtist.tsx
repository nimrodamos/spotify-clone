// DisplayArtist.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { IArtist, ITrack } from "@/types/types";
import { api } from "@/api";
import { VscVerifiedFilled } from "react-icons/vsc";

const DisplayArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artists, loading, error } = useAppData();
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [artist, setArtist] = useState<IArtist | null>(null);

  useEffect(() => {
    if (!loading && artists.length > 0) {
      const foundArtist = artists.find((a) => a._id === id);
      console.log("Found artist:", foundArtist); // Log found artist
      setArtist(foundArtist || null);
    }
  }, [loading, artists, id]);

  useEffect(() => {
    if (artist) {
      api
        .get(`/api/tracks/artist/${artist.name}`)
        .then((response) => setTracks(response.data))
        .catch(() => console.error("Failed to fetch tracks for this artist."));
    }
  }, [artist]);

  if (loading || !artists.length) return <p>Loading artists...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="bg-black text-white">
      <div
        className="relative h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${artist.images?.[0]?.url})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
          <div className="flex items-center mb-2">
            <VscVerifiedFilled size={"25px"} color="DeepSkyBlue" />
            Verified Artist
          </div>
          <h2 className="text-7xl font-bold">{artist.name}</h2>
          <p className="text-xl pt-5">
            {artist.followers.total} monthly listeners
          </p>
          <a
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-green-500 hover:underline"
          >
            Listen on Spotify
          </a>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Popular Tracks</h3>
        <ul>
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <li key={track.spotifyTrackId} className="flex items-center mb-2">
                <p className="font-bold flex-1">{track.name}</p>
                <p className="text-sm">{track.album}</p>
                <img
                  src={track.albumCoverUrl}
                  alt={track.name}
                  className="w-12 h-12 ml-2"
                />
              </li>
            ))
          ) : (
            <p>No tracks found for this artist.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DisplayArtist;
