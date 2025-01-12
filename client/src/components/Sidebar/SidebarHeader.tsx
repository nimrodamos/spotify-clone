import { AiOutlineClose } from "react-icons/ai";
import { assets } from "../../assets/assets";
import { useUserContext } from "../../Context/UserContext";
import { useState } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { IoCheckmark, IoSearch } from "react-icons/io5";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";

export const SidebarHeader = () => {
    const [filter, setFilter] = useState<'playlists' | 'artists' | null>(null);
    const [sidebarFilter, setSidebarFilter] = useState<'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator'>('Recents');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useUserContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleFilterChange = (filterType: 'playlists' | 'artists') => {
        setFilter(filterType);
    };

    const clearFilter = () => {
        setFilter(null);
    };

    const toggleSearch = () => {
        setIsSearchActive((prev) => {
            if (prev) {
                setSearchQuery("");
            }
            return !prev;
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <div className="p-4 flex flex-col gap-3">
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <img title="Collapse your library" className="w-6 cursor-pointer ml-2" src={assets.stack_icon} alt="" />
                    <p title="Collapse your library" className="font-semibold cursor-pointer">Your Library</p>
                    <div className="flex-grow"></div>
                            <div className="flex items-center cursor-pointer">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <img className="w-4 mr-2 cursor-pointer" src={assets.plus_icon} alt="" />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1" side="top">
                                        Create playlist or folder
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <img className="w-4 ml-2 cursor-pointer" src={assets.arrow_icon} alt="" />
                    </HoverCardTrigger>
                    <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-1" side="top">
                        Show more
                    </HoverCardContent>
                </HoverCard>
                </div>

                {user && user.playlists && (
                    <>
                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2 mt-4">
                            {filter && (
                                <button
                                    className="w-8 h-8 flex items-center justify-center rounded-full font-medium bg-backgroundElevatedHighlight text-white"
                                    onClick={clearFilter}
                                >
                                    <AiOutlineClose size={"1.1rem"} />
                                </button>
                            )}
                            <button
                                className={`px-2 py-1 rounded-2xl font-medium ${filter === 'playlists' ? 'bg-white text-black' : 'bg-backgroundElevatedHighlight text-textBase'}`}
                                onClick={() => handleFilterChange('playlists')}
                            >
                                Playlists
                            </button>
                            <button
                                className={`px-2 py-1 rounded-2xl font-medium ${filter === 'artists' ? 'bg-white text-black' : 'bg-backgroundElevatedHighlight text-textBase'}`}
                                onClick={() => handleFilterChange('artists')}
                            >
                                Artists
                            </button>
                        </div>

                        {/* Search Section */}
                        <div className="relative flex items-center">
                            {/* Search Bar with Animation */}
                            <div
                                className={`absolute top-0 bg-inputBackground flex rounded-md text-currentColor items-center transition-all duration-300 ease-in-out overflow-hidden ${isSearchActive ? "w-[60%]" : "w-10"}`}
                            >
                                <div className={`cursor-pointer hover:bg-backgroundHighlight p-2 hover:rounded-full ${isSearchActive ? "bg-backgroundHighlight hover:rounded-none" : ""}`}>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div>
                                            <IoSearch
                                                onClick={toggleSearch}
                                                className={`hover:bg-backgroundHighlight hover:text-white hover:rounded-full ${isSearchActive ? "bg-backgroundHighlight" : ""}`}
                                                size={"1.5rem"}
                                            />
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-3 ml-2" side="top">
                                        Search in your library
                                    </HoverCardContent>
                                </HoverCard>
                                </div>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    className={`flex-grow bg-backgroundHighlight p-2 outline-none text-medium font-medium text-textBase transition-all duration-300 ease-in-out ${isSearchActive ? "opacity-100" : "opacity-0 w-0"}`}
                                    placeholder={`Search in ${filter || 'Your Library'}...`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ width: isSearchActive ? '100%' : '0' }}
                                />
                            </div>

                            {/* Dropdown Button */}
                            <div className="ml-2 flex items-center flex-row justify-end w-full">
                                <button
                                    className="flex items-center hover:text-white text-currentColor font-medium mt-1 gap-2 relative"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {sidebarFilter}
                                    <TfiMenuAlt className="mt-1" size={"1.5rem"} />
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute top-full mt-6 w-48 bg-backgroundElevatedHighlight text-white font-medium rounded shadow-xl z-10">
                                        <ul className="flex flex-col">
                                            <li className="px-4 py-2 text-xs font-extrabold text-currentColor">Sort by</li>
                                            {['Recents', 'Recently Added', 'Alphabetical', 'Creator'].map((option) => (
                                                <li
                                                    key={option}
                                                    className={`px-4 py-2 hover:bg-backgroundTintedHighlight cursor-pointer flex justify-between items-center ${sidebarFilter === option ? 'text-essentialPositive' : ''}`}
                                                    onClick={() => {
                                                        setSidebarFilter(option as 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator');
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {option}
                                                    {sidebarFilter === option && <span className="text-essentialPositive"><IoCheckmark size={"1.3rem"} /></span>}
                                                </li>
                                                
                                            ))}
                                            <li className="border-t border-backgroundTintedHighlight my-1 ml-1 mr-2"></li>
                                            <li className="px-4 py-2 text-xs font-extrabold text-currentColor">View as</li>
                                            {['Compact', 'List', 'Grid'].map((option) => (
                                                <li
                                                    key={option}
                                                    className={`px-4 py-2 hover:bg-backgroundTintedHighlight cursor-pointer flex justify-between items-center ${option === 'List' ? 'text-essentialPositive' : ''}`}
                                                    onClick={() => {
                                                        // Handle view change here
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {option}
                                                    {option === 'List' && <span className="text-essentialPositive"><IoCheckmark size={"1.3rem"} /></span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
