import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
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
  fetchAlbumById: (id: string) => Promise<IAlbum | null>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
      setIsRsbOpen(false);
    } else {
      setRsbMode(mode);
      setIsRsbOpen(true);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await api.get(
        "/api/albums/limited?limit=20&random=true"
      );
      setAlbums(response.data);
    } catch (err: any) {
      setError("Failed to fetch albums.");
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await api.get(
        "/api/artists/limited?limit=20&random=true"
      );
      setArtists(response.data);
    } catch (err: any) {
      setError("Failed to fetch artists.");
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/api/playlists");
      setPlaylists(response.data);
    } catch (err: any) {
      setError("Failed to fetch playlists.");
    }
  };

  const fetchTracks = async () => {
    try {
      const response = await api.get("/api/tracks");
      setTracks(response.data);
    } catch (err: any) {
      setError("Failed to fetch tracks.");
    }
  };

  const fetchAlbumById = async (id: string): Promise<IAlbum | null> => {
    try {
      const response = await api.get(`/api/albums/${id}`);
      return response.data;
    } catch {
      return null;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAlbums(),
        fetchArtists(),
        fetchPlaylists(),
        fetchTracks(),
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
        fetchAlbumById,
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
