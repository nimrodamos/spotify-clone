import React, { useEffect, useState } from 'react';
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaPlay } from 'react-icons/fa';
import { assets } from '@/assets/assets';
import { IoIosPause } from 'react-icons/io';

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
    const { user } = useUserContext();
    const [playIcon, setPlayIcon] = useState<'play' | 'pause'>('play');
    const [artistPlayIcon, setArtistPlayIcon] = useState<'play' | 'pause'>('play');

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await api.get('/api/playlists');
                console.log('Fetched playlists:', response.data);
                if (Array.isArray(response.data)) {
                    setPlaylists(response.data);
                    const artistNames = response.data.flatMap((playlist: Playlist) =>
                        playlist.tracks.map(track => track.artist)
                    );
                    fetchArtists(artistNames);
                } else {
                    setPlaylists([]);
                }
            } catch (error) {
                console.error('Error fetching playlists', error);
            }
        };

        const fetchArtists = async (artistNames: string[]) => {
            try {
                const uniqueArtistNames = [...new Set(artistNames)];
                const artistPromises = uniqueArtistNames.map(name =>
                    api.get(`/api/artists/name/${name}`)
                );
                const artistResponses = await Promise.all(artistPromises);
                const fetchedArtists = artistResponses.map(response => response.data);
                setArtists(fetchedArtists);
            } catch (error) {
                console.error('Error fetching artists', error);
            }
        };

        if (user) {
            fetchPlaylists();
        }
    }, [user]);

    const navigate = useNavigate();

    const handleAlbumClick = (_id: string) => {
        navigate(`/playlist/${_id}`);
    };

    const handlePlayIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPlayIcon((prev) => {
            const newState = prev === 'play' ? 'pause' : 'play';
            if (newState === 'pause') {
                setArtistPlayIcon('play');
            }
            return newState;
        });
    };

    const handleArtistPlayIconClick = () => {
        setArtistPlayIcon((prev) => {
            const newState = prev === 'play' ? 'pause' : 'play';
            if (newState === 'pause') {
                setPlayIcon('play');
            }
            return newState;
        });
    };

    return (
        <div className="grid grid-cols-1 p-2">
            {user && user._id && playlists.map((playlist: Playlist) => (
                playlist.owner._id === user._id && (
                    <div className='hover:bg-backgroundHighlight flex items-center rounded p-2 relative group' key={playlist._id} onClick={() => handleAlbumClick(playlist._id)}>
                        {playlist.tracks.length > 0 && (
                            <div className="relative">
                                <img src={playlist.tracks[0].albumCoverUrl} alt={playlist.tracks[0].name} className="w-14 rounded" />
                                <div className="absolute inset-0 flex items-center justify-center bg-backgroundElevatedHighlight rounded bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" onClick={handlePlayIconClick}>
                                    {playIcon === 'play' ? (
                                        <FaPlay className="text-white text-2xl hover:scale-[1.04]" />
                                    ) : (
                                        <IoIosPause className="text-white text-4xl hover:scale-[1.04]" />
                                    )}
                                </div>
                            </div>
                        )}
                        <div className='ml-4'>
                            <p className={`font-semibold ${playIcon !== 'play' ? 'text-essentialPositive' : ''}`}>{playlist.PlaylistTitle}</p>
                            {playIcon !== 'play' && (
                                <img src={assets.volume_icon} alt="Volume" className="absolute right-2 top-8 w-5 h-5 text-essentialPositive" style={{ filter: 'invert(35%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(90%) contrast(90%)' }} />
                            )}
                            <p className="text-sm text-textSubdued">{playlist.description}</p>
                        </div>
                    </div>
                )
            ))}
            {artists.map((artist: Artist) => (
                <div className='hover:bg-backgroundHighlight flex items-center rounded p-2 relative group' key={artist._id} onClick={() => navigate(`/artist/${artist._id}`)}>
                    <div className="relative">
                        <img src={artist.images[0]?.url} alt={artist.name} className="w-14 h-14 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center bg-backgroundElevatedHighlight rounded-full bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleArtistPlayIconClick(); }}>
                            {artistPlayIcon === 'play' ? (
                                <FaPlay className="text-white text-2xl hover:scale-[1.04]" />
                            ) : (
                                <IoIosPause className="text-white text-4xl hover:scale-[1.04]" />
                            )}
                        </div>
                    </div>
                    <div className='ml-4'>
                        <p className={`font-semibold ${artistPlayIcon !== 'play' ? 'text-essentialPositive' : ''}`}>{artist.name}</p>
                        {artistPlayIcon !== 'play' && (
                            <img src={assets.volume_icon} alt="Volume" className="absolute right-2 top-8 w-5 h-5 text-essentialPositive" style={{ filter: 'invert(35%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(90%) contrast(90%)' }} />
                        )}
                        <p className="text-sm text-textSubdued">Artist</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SidebarPlaylistAndArtists;

