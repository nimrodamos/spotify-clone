import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { api } from "@/api";
import { IAlbum, IArtist, IPlaylist, ITrack } from "@/types/types";

type RsbMode = "queue" | "song";

interface AppDataContextType {
  albums: IAlbum[];
  artists: IArtist[];
  playlists: IPlaylist[];
  tracks: ITrack[];
  loading: boolean;
  error: string | null;
  isRsbOpen: boolean;
  rsbMode: RsbMode;
  toggleRsb: (mode: RsbMode) => void;
  setRsbMode: (mode: RsbMode) => void;
  setIsRsbOpen: (isOpen: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRsbOpen, setIsRsbOpen] = useState<boolean>(false);
  const [rsbMode, setRsbMode] = useState<RsbMode>("queue");

  const toggleRsb = (mode: RsbMode) => {
    if (isRsbOpen && rsbMode === mode) {
      // Close the sidebar if it's already open and the same button is clicked
      setIsRsbOpen(false);
    } else {
      // Open the sidebar and set the mode
      setRsbMode(mode);
      setIsRsbOpen(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          albumsResponse,
          artistsResponse,
          playlistsResponse,
          tracksResponse,
        ] = await Promise.all([
          api.get("/api/albums/limited?limit=20&random=true"),
          api.get("/api/artists/limited?limit=20&random=true"),
          api.get("/api/playlists"),
          api.get("/api/tracks"),
        ]);
        setAlbums(albumsResponse.data);
        setArtists(artistsResponse.data);
        setPlaylists(playlistsResponse.data);
        setTracks(tracksResponse.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        albums,
        artists,
        playlists,
        tracks,
        loading,
        error,
        isRsbOpen,
        rsbMode,
        toggleRsb,
        setRsbMode,
        setIsRsbOpen,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};
