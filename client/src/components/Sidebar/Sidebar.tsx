import { SidebarHeader } from "./SidebarHeader";
import { SidebarPlaylistPrompt } from "./SidebarPlaylistPrompt";
import { SidebarPodcastPrompt } from "./SidebarPodcastPrompt";
import { SidebarLinks } from "./SidebarLinks";
import { SidebarLanguageSelector } from "./SidebarLanguageSelector";
import { useUserContext } from "../../Context/UserContext.tsx";
import SidebarPlaylistAndArtists from "./SidebarPlaylistAndArtists.tsx";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const { user } = useUserContext();

  const [filter, setFilter] = useState<'playlists' | 'artists' | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator'>('Recents');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const clearFilter = () => {
    setFilter(null);
    setSearchQuery("");
  };

  return (
    <div className="flex h-[100%] min-w-[26.5rem] text-textBase">
      <div className="flex-grow">
        <div className="bg-backgroundBase h-full rounded">
          <SidebarHeader
            filter={filter}
            setFilter={setFilter}
            sidebarFilter={sidebarFilter}
            setSidebarFilter={setSidebarFilter}
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearFilter={clearFilter}
          />
          <div className="h-fit overflow-auto bg-backgroundBase">
                      {user?.playlists ? (
                        <SidebarPlaylistAndArtists
                          filter={filter}
                          searchQuery={searchQuery}
                          sidebarFilter={sidebarFilter}
                          setFilter={setFilter}
                          setSidebarFilter={setSidebarFilter}
                          setSearchQuery={setSearchQuery}
                          clearFilter={clearFilter}
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
        </div>
      </div>
      <div
        className="w-[0.1rem] h-full rounded cursor-col-resize hover:bg-essentialSubdued transition-all ml-1 mr-1 duration-300"
      ></div>
    </div>
  );
};

export { Sidebar };