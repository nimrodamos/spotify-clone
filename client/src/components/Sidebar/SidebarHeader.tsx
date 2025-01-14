import { AiOutlineClose } from "react-icons/ai";
import { assets } from "../../assets/assets";
import { useUserContext } from "../../Context/UserContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";

interface SidebarHeaderProps {
    filter: 'playlists' | 'artists' | null;
    setFilter: (filter: 'playlists' | 'artists' | null) => void;
    sidebarFilter: 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator';
    setSidebarFilter: (filter: 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator') => void;
    isSearchActive: boolean;
    setIsSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    clearFilter: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    filter,
    setFilter,
    clearFilter,
}) => {
    const { user } = useUserContext();

    return (
        <div className="p-2 ml-1 flex flex-col gap-3">
            {/* Header Section */}
            <div className="flex items-center p-2 gap-2">
            <img title="Collapse your library" className="w-6 cursor-pointer ml-1 mt-1" src={assets.stack_icon} alt="" />
            <p title="Collapse your library" className="font-semibold cursor-pointer ml-1">Your Library</p>
            <div className="flex-grow"></div>
            <div className="flex items-center cursor-pointer mr-2">
                <HoverCard>
                <HoverCardTrigger asChild>
                    <img className="w-4 mt-1 mr-2 cursor-pointer" src={assets.plus_icon} alt="" />
                </HoverCardTrigger>
                <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1" side="top">
                    Create playlist or folder
                </HoverCardContent>
                </HoverCard>
            </div>
            <HoverCard>
                {user && (
                <HoverCardTrigger asChild>
                    <img className="w-4 mt-1 mr-2 cursor-pointer" src={assets.arrow_icon} alt="" />
                </HoverCardTrigger>
                )}
                <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1" side="top">
                Show more
                </HoverCardContent>
            </HoverCard>
            </div>

            {user && user.playlists && (
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
                    className={`px-3 py-1 rounded-2xl font-medium ${filter === 'playlists' ? 'bg-white text-black' : 'bg-backgroundElevatedHighlight text-textBase'}`}
                    onClick={() => setFilter('playlists')}
                >
                    Playlists
                </button>
                <button
                    className={`px-2 py-1 rounded-2xl font-medium ${filter === 'artists' ? 'bg-white text-black' : 'bg-backgroundElevatedHighlight text-textBase'}`}
                    onClick={() => setFilter('artists')}
                >
                    Artists
                </button>
                </div>
            </>
            )}
        </div>
    );
};