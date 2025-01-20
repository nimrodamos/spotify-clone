import React, { useEffect, useState } from "react";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import CarouselArtists from "./Artists/CarouselArtists";
import CarouselAlbums from "./Albums/CarouselAlbums";
import FilterButtons from "./FilterButtons";
import PersonalizedPlaylists from "./Playlists/PersonalizedPlaylists";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { IAlbum } from "@/types/types";
import CarouselWhatsNew from "./CarouselWhatsNew";
import CarouselTopTracks from "./CarouselTopTracks";
import CarouselRecentlyPlayed from "./CarouselRecentlyPlayed";

const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="hover:underline text-textSubdued text-sm ">
    Show All
  </button>
);

const fetchAlbums = async () => {
  const response = await api.get("/api/albums/offset?offset=0&limit=20");
  return response.data;
};

const fetchArtists = async () => {
  const response = await api.get("/api/artists/offset?offset=0&limit=20");
  return response.data;
};

const fetchPlaylists = async () => {
  const response = await api.get("/api/playlists");
  return response.data;
};

const DisplayHome: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const {
    data: albums = { data: [], total: 0, hasMore: false },
    isLoading: loadingAlbums,
    error: albumsError,
  } = useQuery({ queryKey: ["albums"], queryFn: fetchAlbums });

  const {
    data: artists = { data: [], total: 0, hasMore: false },
    isLoading: loadingArtists,
    error: artistsError,
  } = useQuery({ queryKey: ["artists"], queryFn: fetchArtists });

  const {
    data: playlists = [],
    isLoading: loadingPlaylists,
    error: playlistsError,
  } = useQuery({ queryKey: ["playlists"], queryFn: fetchPlaylists });

  useEffect(() => {
    if (albumsError) console.error("Albums fetch error:", albumsError);
    if (artistsError) console.error("Artists fetch error:", artistsError);
    if (playlistsError) console.error("Playlists fetch error:", playlistsError);
  }, [albumsError, artistsError, playlistsError]);

  const [filter, setFilter] = useState<"all" | "music" | "podcasts">("all");

  const filteredAlbums = React.useMemo(() => {
    if (!albums?.data || !Array.isArray(albums.data)) return [];
    if (filter === "music")
      return albums.data.filter((album: IAlbum) =>
        album.genres?.includes("music")
      );
    if (filter === "podcasts") return [];
    return albums.data;
  }, [filter, albums.data]);

  if (loadingAlbums || loadingArtists || loadingPlaylists)
    return <div className="text-center text-white">Loading...</div>;

  if (albumsError || artistsError || playlistsError)
    return <div className="text-center text-red-500">Failed to load data</div>;

  return (
    <div className="min-h-full w-full text-white">
      <div className="bg-gradient-to-b from-[#1b1b1b] via-backgroundBase/100 to-backgroundBase w-full">
        {user && <FilterButtons filter={filter} setFilter={setFilter} />}
        <div className="pl-8 pr-4">
          {user && (
            <div>
              <h1 className="font-bold text-2xl pl-3 py-3">
                Made for {user.displayName}
              </h1>
              <PersonalizedPlaylists playlists={playlists} />
            </div>
          )}

            {user && (
            <>
              <div className="flex justify-between items-center pl-3 py-3">
              <h1
                className="font-bold text-2xl cursor-pointer hover:underline"
                onClick={() => navigate("/whats-new")}
              >
                What's New
              </h1>
              <ShowAllButton onClick={() => navigate("/whats-new")} />
              </div>
              <CarouselWhatsNew />
            </>
            )}

          <div className="flex justify-between items-center pl-3 py-3">
            <h1
              className="font-bold text-2xl cursor-pointer hover:underline"
              onClick={() => navigate("/artists")}
            >
              Popular Artists
            </h1>
            <ShowAllButton onClick={() => navigate("/artists")} />
          </div>
          {Array.isArray(artists.data) && artists.data.length > 0 ? (
            <CarouselArtists artists={artists.data} />
          ) : (
            <p className="text-center text-gray-400">No artists available</p>
          )}

          <div className="flex justify-between items-center pl-3 py-3">
            <h1
              className="font-bold text-2xl cursor-pointer hover:underline"
              onClick={() => navigate("/albums")}
            >
              Featured Albums
            </h1>
            <ShowAllButton onClick={() => navigate("/albums")} />
          </div>
          {Array.isArray(filteredAlbums) && filteredAlbums.length > 0 ? (
            <CarouselAlbums albums={filteredAlbums} />
          ) : (
            <p className="text-center text-gray-400">No albums available</p>
          )}

            {user && (
            <>
              <div className="flex justify-between items-center pl-3 py-3">
              <h1
                className="font-bold text-2xl cursor-pointer hover:underline"
                onClick={() => navigate("/top-tracks")}
              >
                Top Tracks
              </h1>
              <ShowAllButton onClick={() => navigate("/top-tracks")} />
              </div>
              <CarouselTopTracks />
            </>
            )}

            {user && (
            <>
              <div className="flex justify-between items-center pl-3 py-3">
              <h1
                className="font-bold text-2xl cursor-pointer hover:underline"
                onClick={() => navigate("/recently-played")}
              >
                Recently Played
              </h1>
              <ShowAllButton onClick={() => navigate("/recently-played")} />
              </div>
              <CarouselRecentlyPlayed />
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default DisplayHome;
