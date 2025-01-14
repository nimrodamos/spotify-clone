// AppDataContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { api } from "@/api";
import { IAlbum, IArtist, IPlaylist } from "@/types/types";

interface AppDataContextType {
  albums: IAlbum[];
  artists: IArtist[];
  playlists: IPlaylist[];
  loading: boolean;
  error: string | null;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [albumsResponse, artistsResponse, playlistsResponse] =
          await Promise.all([
            api.get("/api/albums/limited?limit=20&random=true"),
            api.get("/api/artists/limited?limit=20&random=true"),
            api.get("/api/playlists"),
          ]);
        console.log("Artists fetched:", artistsResponse.data); // Log artists
        setAlbums(albumsResponse.data);
        setArtists(artistsResponse.data);
        setPlaylists(playlistsResponse.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{ albums, artists, playlists, loading, error }}
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
