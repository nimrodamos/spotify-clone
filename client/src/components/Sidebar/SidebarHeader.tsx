import { AiOutlineClose } from "react-icons/ai";
import { assets } from "../../assets/assets";
import { useUserContext } from "../../Context/UserContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import { FaRegFolder } from "react-icons/fa";
import axios from "axios";

interface SidebarHeaderProps {
  filter: "playlists" | "artists" | null;
  setFilter: (filter: "playlists" | "artists" | null) => void;
  sidebarFilter: "Recents" | "Recently Added" | "Alphabetical" | "Creator";
  setSidebarFilter: (
    filter: "Recents" | "Recently Added" | "Alphabetical" | "Creator"
  ) => void;
  isSearchActive: boolean;
  hasPlaylists: boolean;
  setIsSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilter: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  filter,
  setFilter,
  clearFilter,
  hasPlaylists,
}) => {
  const { user } = useUserContext();

  const createPlaylist = async () => {
    if (!user) {
      console.error("User is not logged in");
      alert("Please log in to create a playlist.");
      return;
    }
  
    try {
      const { data: playlists } = await axios.get(
        "https://localhost:5000/api/playlists/user",
        { withCredentials: true }
      );
      const playlistNumber = playlists.length + 1;
      const newPlaylistTitle = `My Playlist #${playlistNumber}`;
      const response = await axios.post(
        "https://localhost:5000/api/playlists/",
        {
          PlaylistTitle: newPlaylistTitle,
          owner: user._id,
        },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        console.log("Playlist created successfully:", response.data);
        window.dispatchEvent(new Event("createPlaylist")); // to trigger sidebar refresh
      } else {
        console.error("Failed to create playlist:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist. Please try again.");
    }
  };

  return (
    <div className="p-2 ml-1 flex flex-col gap-3">
      {/* Header Section */}
      <div className="flex items-center p-2 gap-2">
        <img
          title="Collapse your library"
          className="w-6 cursor-pointer ml-1 mt-1"
          src={assets.stack_icon}
          alt=""
        />
        <p
          title="Collapse your library"
          className="font-semibold cursor-pointer ml-1"
        >
          Your Library
        </p>
        <div className="flex-grow z-100"></div>
        <div className="flex items-center cursor-pointer mr-2">
          <HoverCard>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <HoverCardTrigger asChild>
                  <div className="hover:bg-backgroundElevatedHighlight border-none outline-none hover:border-none hover:outline-none mr-1 mt-1 p-2 rounded-full cursor-pointer">
                    <img
                      className="w-4 cursor-pointer"
                      src={assets.plus_icon}
                      alt=""
                    />
                  </div>
                </HoverCardTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="text-start outline-none bg-backgroundElevatedHighlight hover:outline-none text-white text-sm font-medium rounded shadow-xl"
                style={{ zIndex: 9999 }}
                side="bottom"
                align="end"
              >
                <div className="flex flex-col gap-1 p-1">
                  <DropdownMenuItem onSelect={() => createPlaylist()}>
                    <div className="flex items-center gap-2 p-2 hover:bg-essentialSubdued rounded-[2px]">
                      <PiMusicNotesPlusBold size={"1.4rem"} />
                      Create a new playlist
                    </div>
                  </DropdownMenuItem>
                  <div className="flex items-center gap-2 p-2 rounded-[2px] hover:bg-essentialSubdued">
                    <DropdownMenuItem
                      onSelect={() => console.log("Create a folder")}
                    >
                      <div className="flex items-center gap-2 ">
                        <FaRegFolder size={"1.4rem"} />
                        Create a new folder
                      </div>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <HoverCardContent
              className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1"
              side="top"
            >
              Create playlist or folder
            </HoverCardContent>
          </HoverCard>
        </div>
        <HoverCard>
          {user && (
            <HoverCardTrigger asChild>
              <div className="hover:bg-backgroundElevatedHighlight border-none outline-none hover:border-none hover:outline-none mr-1 mt-1 p-2 rounded-full cursor-pointer">
                <img
                  className="w-4  cursor-pointer"
                  src={assets.arrow_icon}
                  alt=""
                />
              </div>
            </HoverCardTrigger>
          )}
          <HoverCardContent
            className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1"
            side="top"
          >
            Show more
          </HoverCardContent>
        </HoverCard>
      </div>

      {user && hasPlaylists && (
        <>
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mt-1 sticky top-0 bg-background z-10">
            {filter && (
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full font-medium bg-backgroundElevatedHighlight text-white"
                onClick={clearFilter}
              >
                <AiOutlineClose size={"1.1rem"} />
              </button>
            )}
            <button
              className={`px-3 py-1 rounded-2xl font-medium ${
                filter === "playlists"
                  ? "bg-white text-black"
                  : "bg-backgroundElevatedHighlight text-textBase"
              }`}
              onClick={() => setFilter("playlists")}
            >
              Playlists
            </button>
            <button
              className={`px-2 py-1 rounded-2xl font-medium ${
                filter === "artists"
                  ? "bg-white text-black"
                  : "bg-backgroundElevatedHighlight text-textBase"
              }`}
              onClick={() => setFilter("artists")}
            >
              Artists
            </button>
          </div>
        </>
      )}
    </div>
  );
};
