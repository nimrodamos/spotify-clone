import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { api } from "@/api";
import { IAlbum, IArtist, IPlaylist, ITrack } from "@/types/types";

type RsbMode = "queue" | "song";

interface AppDataContextType {
  // Data states
  albums: IAlbum[];
  artists: IArtist[];
  playlists: IPlaylist[];
  tracks: ITrack[];
  loading: boolean;
  error: string | null;

  // Fetch functions
  fetchAlbums: () => Promise<void>;
  fetchArtists: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  fetchTracks: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<IAlbum | null>;
  fetchAllData: () => Promise<void>;

  // LSB states
  isLsbOpen: boolean;
  lsbWidth: number;
  setLsbWidth: (width: number) => void;
  toggleLsb: () => void;
  isResizingLsb: boolean;
  setIsResizingLsb: (isResizing: boolean) => void;
  setIsLsbOpen: (isOpen: boolean) => void;
  
  // RSB states
  isRsbOpen: boolean;
  rsbWidth: number;
  setRsbWidth: (width: number) => void;
  isResizingRsb: boolean;
  setIsResizingRsb: (isResizing: boolean) => void;
  rsbMode: RsbMode;
  setRsbMode: (mode: RsbMode) => void;
  toggleRsb: (mode: RsbMode) => void;
  setIsRsbOpen: (isOpen: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const SIDEBAR_CONSTRAINTS = {
  MIN_WIDTH: 280,
  MAX_WIDTH: 420,
  COLLAPSED_WIDTH: 72
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Data states
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // LSB states
  const [isLsbOpen, setIsLsbOpen] = useState(true);
  const [lsbWidth, setLsbWidth] = useState(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
  const [isResizingLsb, setIsResizingLsb] = useState(false);
  
  // RSB states
  const [isRsbOpen, setIsRsbOpen] = useState(false);
  const [rsbWidth, setRsbWidth] = useState(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
  const [isResizingRsb, setIsResizingRsb] = useState(false);
  const [rsbMode, setRsbMode] = useState<RsbMode>("queue");

  // Fetch functions
  const fetchAlbums = async () => {
    try {
      const response = await api.get("/api/albums/limited?limit=20&random=true");
      setAlbums(response.data);
    } catch (err: any) {
      setError("Failed to fetch albums.");
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await api.get("/api/artists/limited?limit=20&random=true");
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

  // Toggle functions
  const toggleLsb = () => {
    setIsLsbOpen(!isLsbOpen);
    setLsbWidth(isLsbOpen ? SIDEBAR_CONSTRAINTS.COLLAPSED_WIDTH : SIDEBAR_CONSTRAINTS.MIN_WIDTH);
  };

  const toggleRsb = (mode: RsbMode) => {
    if (isRsbOpen && rsbMode === mode) {
      setIsRsbOpen(false);
    } else {
      setRsbMode(mode);
      setIsRsbOpen(true);
    }
  };

  // Width constraints
  useEffect(() => {
    if (!isResizingLsb && isLsbOpen) {
      if (lsbWidth < SIDEBAR_CONSTRAINTS.MIN_WIDTH) setLsbWidth(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
      if (lsbWidth > SIDEBAR_CONSTRAINTS.MAX_WIDTH) setLsbWidth(SIDEBAR_CONSTRAINTS.MAX_WIDTH);
    }
    
    if (!isResizingRsb && isRsbOpen) {
      if (rsbWidth < SIDEBAR_CONSTRAINTS.MIN_WIDTH) setRsbWidth(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
      if (rsbWidth > SIDEBAR_CONSTRAINTS.MAX_WIDTH) setRsbWidth(SIDEBAR_CONSTRAINTS.MAX_WIDTH);
    }
  }, [lsbWidth, rsbWidth, isResizingLsb, isResizingRsb, isLsbOpen, isRsbOpen]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        // Data values
        albums,
        artists,
        playlists,
        tracks,
        loading,
        error,

        // Fetch functions
        fetchAlbums,
        fetchArtists,
        fetchPlaylists,
        fetchTracks,
        fetchAlbumById,
        fetchAllData,

        // LSB values
        isLsbOpen,
        lsbWidth,
        setLsbWidth,
        toggleLsb,
        isResizingLsb,
        setIsResizingLsb,
        setIsLsbOpen,
        
        // RSB values
        isRsbOpen,
        rsbWidth,
        setRsbWidth,
        isResizingRsb,
        setIsResizingRsb,
        rsbMode,
        setRsbMode,
        toggleRsb,
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