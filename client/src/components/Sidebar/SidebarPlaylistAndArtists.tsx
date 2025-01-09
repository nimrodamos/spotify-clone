import React, { useEffect, useState } from 'react';
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaPause, FaPlay } from 'react-icons/fa';
import volume from '../../assets/volume.svg';
import { assets } from '@/assets/assets';

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

const SidebarPlaylistAndArtists: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const { user } = useUserContext();
    const [playIcon, setPlayIcon] = useState<'play' | 'pause'>('play');

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await api.get('/api/playlists');
                console.log('Fetched playlists:', response.data);
                if (Array.isArray(response.data)) {
                    setPlaylists(response.data);
                } else {
                    setPlaylists([]);
                }
            } catch (error) {
                console.error('Error fetching playlists', error);
            }
        };

        fetchPlaylists();
    }, [user]);

    const navigate = useNavigate();

    const handleAlbumClick = (_id: string) => {
        navigate(`/playlist/${_id}`);
    };

    return (
        <div className="grid grid-cols-1 p-2">
            <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
            {user && user._id && playlists.map((playlist: Playlist) => (
            playlist.owner._id === user._id && (
            <div className='hover:bg-backgroundHighlight flex items-center rounded p-2 relative group' key={playlist._id} onClick={() => handleAlbumClick(playlist._id)}>
            {playlist.tracks.length > 0 && (
            <div className="relative">
            <img src={playlist.tracks[0].albumCoverUrl} alt={playlist.tracks[0].name} className="w-16 rounded" />
            <div className="absolute inset-0 flex items-center justify-center bg-backgroundElevatedHighlight rounded bg-opacity-50 z-10 opacity-0 group-hover:opacity-100" onClick={(e) => {
                e.stopPropagation();
                setPlayIcon((prev) => (prev === 'play' ? 'pause' : 'play'));
            }}>
                {playIcon === 'play' ? (
                <FaPlay className="text-white text-2xl hover:scale-[1.04]" />
                ) : (
                <FaPause className="text-white text-2xl hover:scale-[1.04] h-12" />
                )}
            </div>
            </div>
            )}
            <div className='ml-2'>
            <p className={`font-semibold ${playIcon !== 'play' ? 'text-essentialPositive' : ''}`}>{playlist.PlaylistTitle}</p>
            {playIcon !== 'play' && (
                <img src={assets.volume_icon} alt="Volume" className="absolute right-2 top-8 w-5 h-5 text-essentialPositive" style={{ filter: 'invert(35%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(90%) contrast(90%)' }} />
            )}
            <p className="text-sm text-textSubdued">{playlist.description}</p>
            </div>
            </div>
            )
            ))}
        </div>
    );
};

export default SidebarPlaylistAndArtists;