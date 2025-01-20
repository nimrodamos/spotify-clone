import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { ITrack, IArtist } from "@/types/types";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AiFillPlayCircle } from "react-icons/ai";
import { getDominantColor } from "@/lib/getDominantColor";

const fetchArtistBySpotifyUrl = async (
  spotifyUrl: string
): Promise<IArtist> => {
  const response = await api.get(`/api/artists/spotify/${spotifyUrl}`);
  return response.data;
};

const fetchTracksByArtist = async (artistName: string): Promise<ITrack[]> => {
  const response = await api.get(
    `/api/tracks/artist/${encodeURIComponent(artistName)}`
  );
  return response.data;
};

const DisplayArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [backgroundColor, setBackgroundColor] =
    useState<string>("rgb(0, 0, 0)");

  const extractSpotifyId = (url: string) => {
    return url.split("/").pop();
  };

  const {
    data: artist,
    isLoading: loadingArtist,
    error: artistError,
  } = useQuery({
    queryKey: ["artist", id],
    queryFn: () =>
      id
        ? fetchArtistBySpotifyUrl(extractSpotifyId(id)!)
        : Promise.reject("No ID provided"),

    enabled: Boolean(id),
  });

  const {
    data: tracks,
    isLoading: loadingTracks,
    error: tracksError,
  } = useQuery({
    queryKey: ["tracks", artist?.name],
    queryFn: () => fetchTracksByArtist(artist!.name),
    enabled: Boolean(artist?.name),
  });

  useEffect(() => {
    if (artist?.images?.[0]?.url) {
      getDominantColor(artist.images[0].url)
        .then((color) => setBackgroundColor(color))
        .catch((err) =>
          console.error("Failed to extract dominant color:", err)
        );
    }
  }, [artist]);

  if (loadingArtist || loadingTracks)
    return <p className="text-center text-xl">Loading...</p>;

  if (artistError || tracksError)
    return (
      <p className="text-center text-xl text-red-500">
        Failed to load artist data
      </p>
    );

  if (!artist) return <p className="text-center text-xl">Artist not found</p>;

  return (
    <div
      className="relative text-white"
      style={{
        background: `linear-gradient(to bottom, ${backgroundColor}, #121212)`,
      }}
    >
      <div className="relative">
        <img
          src={artist.images?.[0]?.url || "/default-artist.jpg"}
          alt={artist.name}
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-[#16151575] to-transparent w-full">
          <div className="mb-6"></div>
          <div className="flex items-center gap-2 mb-2">
            <VscVerifiedFilled size={"25px"} color="DeepSkyBlue" />
            Verified Artist
          </div>
          <h2 className="text-8xl text-white font-bold">{artist.name}</h2>
          <p className="text-l pt-7 text-background ">
            {artist.followers?.total?.toLocaleString() || "0"} monthly listeners
          </p>
        </div>
      </div>

      <div className="m-4 flex gap-4 items-center ">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute bg-black w-[50px] h-[50px] rounded-full opacity-80"></div>
          <AiFillPlayCircle
            size={"65px"}
            color="#1ed760"
            className="relative"
          />
        </div>

        <button className="bg-transparent  border border-white py-1 px-4 rounded-full hover:bg-white hover:text-black transition">
          Follow
        </button>
        <div className=" text-2xl cursor-pointer">&#8230;</div>
      </div>

      <div className="m-4">
        <h3 className="text-2xl font-semibold mb-4">Popular</h3>
        <ul>
          {tracks && tracks.length > 0 ? (
            tracks.map((track, index) => (
              <li
                key={track.spotifyTrackId}
                className="flex items-center mb-2 cursor-pointer"
                onClick={() => navigate(`/track/${track.spotifyTrackId}`)}
              >
                <p className="font-bold mr-4">{index + 1}</p>
                <img
                  src={track.albumCoverUrl}
                  alt={track.name}
                  className="w-12 h-12 mr-4"
                />
                <p className="flex-1">{track.name}</p>
                <p>{(track.durationMs / 60000).toFixed(2)}</p>
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
