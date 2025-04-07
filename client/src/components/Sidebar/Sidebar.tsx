import { SidebarHeader } from "./SidebarHeader";
import SidebarPlaylistAndArtists from "./SidebarPlaylistAndArtists";
import { SidebarPlaylistPrompt } from "./SidebarPlaylistPrompt";
import { SidebarPodcastPrompt } from "./SidebarPodcastPrompt";
import { SidebarLinks } from "./SidebarLinks";
import { SidebarLanguageSelector } from "./SidebarLanguageSelector";
import { useUserContext } from "../../Context/UserContext";
import { useAppData } from "@/Context/AppDataContext";
import { useState, useEffect, useMemo } from "react";
import { SIDEBAR_CONSTRAINTS } from "../../Context/AppDataContext.tsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export const queryKeys = {
  randomArtists: "randomArtists",
};

export const fetchRandomArtists = async () => {
  try {
    const response = await api.get("/api/artists/offset?offset=0&limit=30");
    return response.data;
  } catch (error) {
    console.error("Random Artists API Error:", error);
    throw error;
  }
};

const Sidebar: React.FC = () => {
  const { user } = useUserContext();
  const {
    isLsbOpen,
    lsbWidth,
    setLsbWidth,
    isResizingLsb,
    setIsResizingLsb,
  } = useAppData();

  const [filter, setFilter] = useState<"playlists" | "artists" | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<
    "Recents" | "Recently Added" | "Alphabetical" | "Creator"
  >("Recents");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [playlistCount, setPlaylistCount] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [playlistReady, setPlaylistReady] = useState(false); // ✅ handles header updates

  const hasPlaylists = playlistCount > 0;
  const shouldShowPlaylistUI = user && (hasPlaylists || !hasLoadedOnce);

  useEffect(() => {
    setPlaylistReady(user ? playlistCount > 0 : false);
  }, [playlistCount, user]);

  const clearFilter = () => {
    setFilter(null);
    setSearchQuery("");
  };

  const { data: randomArtists = [] } = useQuery({
    queryKey: [queryKeys.randomArtists],
    queryFn: fetchRandomArtists,
    select: (responseData) => {
      const data = responseData.data || [];
      return data.sort(() => 0.5 - Math.random()).slice(0, 30);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLsb) {
        const newWidth = Math.max(
          Math.min(e.clientX, SIDEBAR_CONSTRAINTS.MAX_WIDTH),
          SIDEBAR_CONSTRAINTS.MIN_WIDTH
        );
        setLsbWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizingLsb(false);

    if (isResizingLsb) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingLsb, setIsResizingLsb, setLsbWidth]);

  const sidebarWidth = useMemo(() => {
    return isLsbOpen ? lsbWidth : SIDEBAR_CONSTRAINTS.COLLAPSED_WIDTH;
  }, [isLsbOpen, lsbWidth]);

  const handlePlaylistCountChange = (count: number) => {
    setPlaylistCount(count);
    setHasLoadedOnce(true);
  };

  return (
    <div
      className="flex h-full text-textBase transition-all duration-300"
      style={{ width: `${sidebarWidth}px`, height: "100%", overflow: "hidden" }}
    >
      <div className="flex-grow h-full">
        <div className="bg-backgroundBase h-full rounded">
          <SidebarHeader
            key={playlistReady ? "has-playlists" : "no-playlists"}
            filter={filter}
            setFilter={setFilter}
            sidebarFilter={sidebarFilter}
            setSidebarFilter={setSidebarFilter}
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearFilter={clearFilter}
            hasPlaylists={playlistReady} // ✅ use evaluated state
            isLsbOpen={isLsbOpen}
            toggleLsb={() => toggleLsb()}
          />
          <div
            className={`h-[calc(100%-67px)] overflow-y-auto no-scrollbar ${
              !isLsbOpen ? "overflow-x-hidden" : ""
            }`}
          >
            {isLsbOpen ? (
              <div className="h-fit overflow-auto bg-backgroundBase transition-opacity duration-300">
                {shouldShowPlaylistUI ? (
                  <SidebarPlaylistAndArtists
                    filter={filter}
                    searchQuery={searchQuery}
                    sidebarFilter={sidebarFilter}
                    setFilter={setFilter}
                    setSidebarFilter={setSidebarFilter}
                    setSearchQuery={setSearchQuery}
                    clearFilter={clearFilter}
                    onPlaylistCountChange={handlePlaylistCountChange}
                  />
                ) : (
                  <>
                    <SidebarPlaylistPrompt />
                    <SidebarPodcastPrompt />
                    <SidebarLinks />
                    <SidebarLanguageSelector />
                  </>
                )}
              </div>
            ) : (
              <div className="h-full overflow-y-auto no-scrollbar">
                {randomArtists.map((artist, index) => (
                  <div
                    key={artist.id || index}
                    className="flex items-center h-[66px] w-full hover:bg-[#1C1C1C]"
                  >
                    <div className="h-[66px] w-[66px] rounded object-cover p-[8px] flex justify-center items-center">
                      <img
                        src={
                          artist.images?.[0]?.url ||
                          "https://via.placeholder.com/50"
                        }
                        alt={artist.name}
                        className="h-[50px] w-[50px] rounded object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="w-1 h-full rounded cursor-col-resize hover:bg-essentialSubdued transition-all ml-1 mr-1 duration-300"
        onMouseDown={() => setIsResizingLsb(true)}
      />
    </div>
  );
};

export { Sidebar };
