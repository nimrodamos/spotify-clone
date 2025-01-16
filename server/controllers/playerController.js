import axios from 'axios';
import { getSpotifyAccessToken } from './spotifyController.js';

const playTrack = async (req, res) => {
    try {
        const spotifyTrackId = req.params.spotifyTrackId; // Get track ID from route params
        const user = req.user; // Already populated by protectRoute

        // Get a valid Spotify access token for the user
        const accessToken = await getSpotifyAccessToken(user);

        await axios.put(
            `https://api.spotify.com/v1/me/player/play`,
            {
                uris: [`spotify:track:${spotifyTrackId}`],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(204).send(); // No content response for success
    } catch (error) {
        console.error('Error playing track:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to play track',
            details: error.response?.data || error.message,
        });
    }
};

export { playTrack };
