import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

const SidebarPlaylistAndArtists: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get('/api/playlists');
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
    }, []);

    return (
        <div className="sidebar-playlists">
            {playlists.map((playlist) => (
                <div key={playlist._id} className="playlist-item">
                    {playlist.tracks.length > 0 && (
                        <img src={playlist.customAlbumCover || 'default-cover-url'} alt={playlist.PlaylistTitle} className="playlist-cover" />
                    )}
                    <p>{playlist.PlaylistTitle}</p>
                </div>
            ))}
        </div>
    );
};

export default SidebarPlaylistAndArtists;