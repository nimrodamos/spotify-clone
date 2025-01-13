import React, { useEffect, useState } from 'react';
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaPlay } from 'react-icons/fa';
import { assets } from '@/assets/assets';
import { IoIosPause } from 'react-icons/io';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card';

interface Playlist {
    _id: string;
    PlaylistTitle: string;
    description: string;
    owner: {
        _id: string;
    };
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

const SidebarPlaylistAndArtists: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const { user } = useUserContext();  // Assuming user comes from context
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);  // State to manage loading

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchPlaylists = async () => {
                try {
                    setLoading(true); // Set loading true before fetching
                    const response = await api.get('/api/playlists');
                    if (Array.isArray(response.data)) {
                        const userPlaylists = response.data.filter((playlist: Playlist) => playlist.owner._id === user._id);
                        setPlaylists(userPlaylists);
                        const artistNames = userPlaylists.flatMap((playlist: Playlist) => playlist.tracks.map(track => track.artist));
                        await fetchArtists(artistNames);
                    }
                } catch (error) {
                    console.error('Error fetching playlists', error);
                } finally {
                    setLoading(false);  // Set loading to false after fetching
                }
            };

            const fetchArtists = async (artistNames: string[]) => {
                try {
                    const uniqueArtistNames = [...new Set(artistNames)];
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

            fetchPlaylists();  // Fetch playlists when user is available
        }
    }, [user]);  // Re-run effect when user changes

    const handleAlbumClick = (_id: string) => {
        navigate(`/playlist/${_id}`);
    };

    const handlePlayIconClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setCurrentlyPlaying((prev) => (prev === id ? null : id));
    };

    if (loading) {
        return <div>Loading...</div>;  // Loading state until data is fetched
    }

    return (
    <div className=''>
        <div className="grid grid-cols-1 p-[0.39rem]">
            {user && user._id && playlists.map((playlist: Playlist) => (
            playlist.owner._id === user._id && (
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
            )
        ))}
            {artists.map((artist: Artist) => (
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
