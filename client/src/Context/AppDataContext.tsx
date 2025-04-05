import React, { createContext, useState, useContext, ReactNode } from "react";
import { ITrack } from "@/types/types";

type RsbMode = "queue" | "song";

interface AppDataContextType {
  // Track data
  tracks: ITrack[];
  loading: boolean;
  error: string | null;
  setTracks: (tracks: ITrack[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Current track state
  currentTrack: Spotify.Track | null;
  setCurrentTrack: (track: Spotify.Track | null) => void;

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

export const SIDEBAR_CONSTRAINTS = {
  MIN_WIDTH: 280,
  MAX_WIDTH: 420,
  COLLAPSED_WIDTH: 72,
  RSB_COLLAPSED_WIDTH: 40,                               
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Track states
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  // LSB states
  const [isLsbOpen, setIsLsbOpen] = useState(true);
  const [lsbWidth, setLsbWidth] = useState(SIDEBAR_CONSTRAINTS.MAX_WIDTH);
  const [isResizingLsb, setIsResizingLsb] = useState(false);

  // RSB states
  const [isRsbOpen, setIsRsbOpen] = useState(false);
  const [rsbWidth, setRsbWidth] = useState(SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH);
  const [isResizingRsb, setIsResizingRsb] = useState(false);
  const [rsbMode, setRsbMode] = useState<RsbMode>("song");

  // Toggle functions
  const toggleLsb = () => {
    setIsLsbOpen(!isLsbOpen);
    setLsbWidth(
      isLsbOpen
        ? SIDEBAR_CONSTRAINTS.COLLAPSED_WIDTH
        : SIDEBAR_CONSTRAINTS.MAX_WIDTH
    );
  };

  const toggleRsb = (mode: RsbMode) => {
    if (isRsbOpen && rsbMode === mode) {
      setIsRsbOpen(false);
      setRsbWidth(SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH);
    } else {
      setRsbMode(mode);
      setIsRsbOpen(true);
      setRsbWidth(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        tracks,
        loading,
        error,
        setTracks,
        setLoading,
        setError,
        currentTrack,
        setCurrentTrack,
        isLsbOpen,
        lsbWidth,
        setLsbWidth,
        toggleLsb,
        isResizingLsb,
        setIsResizingLsb,
        setIsLsbOpen,
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
