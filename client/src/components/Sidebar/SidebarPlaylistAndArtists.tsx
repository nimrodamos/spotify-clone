import React, { useEffect, useState } from 'react';
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaPlay } from 'react-icons/fa';
import { assets } from '@/assets/assets';
import { IoIosPause, IoMdCheckmark } from 'react-icons/io';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';
import { TfiMenuAlt } from 'react-icons/tfi';
import { LucideSearch } from 'lucide-react';

interface Playlist {
    _id: string;
    PlaylistTitle: string;
    description: string;
    owner: string;
    tracks: {
        spotifyTrackId: string;
        name: string;
        artist: string;
        album: string;
        albumCoverUrl: string;
        durationMs: number;
        addedAt: Date;
    }[];
    customAlbumCover?: string;
    totalDuration: number;
    isPublic: boolean;
    createdAt: Date;
}

interface Artist {
    _id: string;
    name: string;
    images: { url: string }[];
}

interface SidebarPlaylistAndArtistsProps {
    filter: 'playlists' | 'artists' | null;
    searchQuery: string;
    sidebarFilter: 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator';
    setFilter: (filter: 'playlists' | 'artists' | null) => void;
    setSidebarFilter: (filter: 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator') => void;
    setSearchQuery: (query: string) => void;
    clearFilter: () => void;
    onPlaylistCountChange?: (count: number) => void;
}

const SidebarPlaylistAndArtists: React.FC<SidebarPlaylistAndArtistsProps> = ({
    filter,
    searchQuery,
    sidebarFilter,
    setSidebarFilter,
    setSearchQuery,
    onPlaylistCountChange,
}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const { user } = useUserContext();
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchPlaylists();
        }
    }, [user]);

    useEffect(() => {
        const handler = () => fetchPlaylists();
        window.addEventListener("createPlaylist", handler);
        return () => window.removeEventListener("createPlaylist", handler);
    }, []);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/playlists/user', { withCredentials: true });
            setPlaylists(response.data);
            onPlaylistCountChange?.(response.data.length); // ✅ this is what updates Sidebar.tsx            
            const artistNames = response.data.flatMap((playlist: Playlist) =>
                playlist.tracks.map((track) => track.artist)
            );
            await fetchArtists(artistNames);
        } catch (error) {
            console.error('Error fetching playlists', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArtists = async (artistNames: string[]) => {
        try {
            const uniqueArtistNames = [...new Set(artistNames.flatMap(name => name.split(',').map(n => n.trim())))];
            const artistPromises = uniqueArtistNames.map(name =>
                api.get(`/api/artists/name/${name}`).catch(error => {
                    if (error.response && error.response.status === 404) {
                        console.warn(`Artist not found: ${name}`);
                        return null;
                    }
                    throw error;
                })
            );
            const artistResponses = await Promise.all(artistPromises);
            const fetchedArtists = artistResponses.filter(response => response && response.data).map(response => response!.data);
            setArtists(fetchedArtists);
        } catch (error) {
            console.error('Error fetching artists', error);
        }
    };

    const handleAlbumClick = (_id: string) => {
        navigate(`/playlist/${_id}`);
    };

    const handlePlayIconClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setCurrentlyPlaying((prev) => (prev === id ? null : id));
    };

    const sortPlaylists = (playlists: Playlist[]) => {
        switch (sidebarFilter) {
            case 'Recently Added':
                return playlists.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'Alphabetical':
                return playlists.sort((a, b) => a.PlaylistTitle.localeCompare(b.PlaylistTitle));
            case 'Recents':
                return playlists.sort((a, b) => b.tracks.length - a.tracks.length);
            case 'Creator':
                if (user) {
                    return [
                        ...playlists.filter(playlist => playlist.owner === user._id),
                        ...playlists.filter(playlist => playlist.owner !== user._id).sort((a, b) => {
                            const artistA = a.tracks[0]?.artist.toLowerCase() || '';
                            const artistB = b.tracks[0]?.artist.toLowerCase() || '';
                            return artistA.localeCompare(artistB);
                        })
                    ];
                }
                return playlists;
            default:
                return playlists;
        }
    };

    const sortArtists = (artists: Artist[]) => {
        switch (sidebarFilter) {
            case 'Creator':
                return artists.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return artists;
        }
    };

    const filteredPlaylists = sortPlaylists(playlists).filter((playlist) =>
        (filter === 'playlists' || filter === null) && playlist.PlaylistTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredArtists = sortArtists(artists).filter((artist) =>
        (filter === 'artists' || filter === null) && artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    const toggleSearch = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.stopPropagation();
        setIsSearchActive((prev) => !prev);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className='h-[30rem] overflow-y-auto'>
            <div className="flex relative items-center">
                <div
                    className={`absolute top-0 ml-[0.9rem] bg-inputBackground flex rounded-r-md text-currentColor items-center transition-all duration-300 ease-in-out overflow-hidden ${isSearchActive ? "w-[60%]" : "w-10"}`}
                >
                    <div onClick={toggleSearch} className={`cursor-pointer z-10 hover:bg-backgroundHighlight hover:text-white p-2 ${isSearchActive ? "bg-backgroundHighlight rounded-l-[4px]" : "rounded-full flex items-center justify-center"}`}>
                    <HoverCard>
                        <HoverCardTrigger asChild>
                        <div className="rounded-full">
                            <LucideSearch
                            className={`hover:bg-backgroundHighlight hover:rounded-full ${isSearchActive ? "bg-backgroundHighlight" : ""}`}
                            size={"1.2rem"}
                            />
                        </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-3 ml-2" side="top">
                        Search in your library
                        </HoverCardContent>
                    </HoverCard>
                    </div>

                    <input
                    type="text"
                    className={`flex-grow bg-backgroundHighlight max-w-[11rem] p-[0.47rem] outline-none rounded-r-[4px] text-sm transition-all duration-300 ease-in-out ${isSearchActive ? "opacity-100" : "opacity-0 w-0"}`}
                    placeholder={`Search in ${filter || 'Your Library'}`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ width: isSearchActive ? '100%' : '0' }}
                    />
                </div>

                {/* Dropdown Button */}
                <div className="mr-5 mt-[0.1rem] flex items-center flex-row justify-end w-full">
                    <button
                    className="flex items-center hover:text-white hover:scale-[1.04] text-sm text-currentColor font-[500] mt-1 gap-2 relative"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                    {sidebarFilter}
                    <TfiMenuAlt className="mt-1" size={"1.2rem"} />
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
                            {sidebarFilter === option && <span className="text-essentialPositive"><IoMdCheckmark size={"1.3rem"} /></span>}
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 mt-2 p-[0.39rem]">
                {user && user._id && filteredPlaylists.map((playlist: Playlist) => (
                    <div className='hover:bg-backgroundHighlight cursor-pointer flex items-center rounded p-2 relative group' key={playlist._id} onClick={() => handleAlbumClick(playlist._id)}>
                        <div className="relative">
                            <img src={playlist.tracks.length > 0 ? playlist.tracks[0].albumCoverUrl : playlist.customAlbumCover} alt={playlist.tracks.length > 0 ? playlist.tracks[0].name : playlist.PlaylistTitle} className="w-[2.9rem] rounded" />
                            <div className="absolute cursor-pointer inset-0 flex items-center justify-center bg-backgroundElevatedHighlight rounded bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" onClick={(e) => handlePlayIconClick(e, playlist._id)}>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        {currentlyPlaying === playlist._id ? (
                                            <IoIosPause className="text-white text-4xl hover:scale-[1.04]" />
                                        ) : (
                                            <FaPlay className="text-white text-2xl hover:scale-[1.04]" />
                                        )}
                                    </HoverCardTrigger>
                                    <HoverCardContent side='top' className='p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-6'>
                                        <p className="text-white">Play {playlist.PlaylistTitle}</p>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                        <div className='ml-4'>
                            <p className={`font-semibold ${currentlyPlaying === playlist._id ? 'text-essentialPositive' : ''}`}>{playlist.PlaylistTitle}</p>
                            {currentlyPlaying === playlist._id && (
                                <img src={assets.volume_icon} alt="Volume" className="absolute right-2 top-8 w-5 h-5 text-essentialPositive" style={{ filter: 'invert(35%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(90%) contrast(90%)' }} />
                            )}
                            <p className="text-sm text-textSubdued">{playlist.description}</p>
                        </div>
                    </div>
                ))}
                {filteredArtists.map((artist: Artist) => (
                    <div className='hover:bg-backgroundHighlight flex items-center cursor-pointer rounded p-2 relative group' key={artist._id} onClick={() => navigate(`/artist/${artist._id}`)}>
                        <div className="relative">
                            <img src={artist.images[0]?.url} alt={artist.name} className="w-14 h-14 rounded-full" />
                            <div className="absolute cursor-pointer inset-0 flex items-center justify-center bg-backgroundElevatedHighlight rounded-full bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handlePlayIconClick(e, artist._id); }}>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        {currentlyPlaying === artist._id ? (
                                            <IoIosPause className="text-white text-4xl hover:scale-[1.04]" />
                                        ) : (
                                            <FaPlay className="text-white text-2xl hover:scale-[1.04]" />
                                        )}
                                    </HoverCardTrigger>
                                    <HoverCardContent side='top' className='p-1 bg-backgroundElevatedHighlight text-white text-sm font-medium rounded shadow-lg mb-6'>
                                        <p className="text-white">Play {artist.name}</p>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                        <div className='ml-4'>
                            <p className={`font-semibold ${currentlyPlaying === artist._id ? 'text-essentialPositive' : ''}`}>{artist.name}</p>
                            {currentlyPlaying === artist._id && (
                                <img src={assets.volume_icon} alt="Volume" className="absolute right-2 top-8 w-5 h-5 text-essentialPositive" style={{ filter: 'invert(35%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(90%) contrast(90%)' }} />
                            )}
                            <p className="text-sm text-textSubdued">Artist</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SidebarPlaylistAndArtists;