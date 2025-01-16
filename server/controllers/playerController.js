import axios from 'axios';
import { getSpotifyAccessToken, getAvailableDevices } from './spotifyController.js';

const playTrack = (() => {
    let isPlaying = false;
    let queuedTrack = null;

    return async (req, res) => {
        try {
            const spotifyTrackId = req.params.spotifyTrackId;

            if (isPlaying) {
                queuedTrack = spotifyTrackId;
                return res.status(202).json({ message: "Track queued for playback" });
            }

            isPlaying = true;
            let currentTrack = spotifyTrackId;

            const user = req.user;
            if (!user) {
                isPlaying = false;
                return res.status(401).json({ error: "User not authenticated" });
            }

            const accessToken = await getSpotifyAccessToken(user);

            const devices = await getAvailableDevices(accessToken);
            if (devices.length === 0) {
                isPlaying = false;
                return res.status(404).json({
                    error: "No Spotify devices found. Please open Spotify on a device and try again.",
                });
            }

            const targetDevice = devices[0];
            if (!targetDevice) {
                isPlaying = false;
                return res.status(400).json({
                    error: "No available device found to play the track.",
                });
            }

            try {
                await axios.put(
                    `https://api.spotify.com/v1/me/player/play?device_id=${targetDevice.id}`,
                    { uris: [`spotify:track:${currentTrack}`] },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } catch (playError) {
                isPlaying = false;
                return res.status(500).json({
                    error: "Failed to start playback on the selected device. Please ensure Spotify is active.",
                });
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));

            currentTrack = queuedTrack;
            queuedTrack = null;

            isPlaying = false;
            res.status(204).send();
        } catch (error) {
            isPlaying = false;
            res.status(500).json({
                error: "Failed to play track",
                details: error.response?.data || error.message,
            });
        }
    };
})();

export { playTrack };
