import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
}

const SidebarPlaylistAndArtists: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get('/api/playlists'); // Adjust the endpoint as needed
                setPlaylists(response.data.items);
            } catch (error) {
                console.error('Error fetching playlists', error);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <div className="sidebar-playlists">
            {playlists.map((playlist) => (
                <div key={playlist.id} className="playlist-item">
                    {playlist.images.length > 0 && (
                        <img src={playlist.images[0].url} alt={playlist.name} className="playlist-cover" />
                    )}
                    <p>{playlist.name}</p>
                </div>
            ))}
        </div>
    );
};

export default SidebarPlaylistAndArtists;