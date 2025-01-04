import axios from "axios";
import mongoose from "mongoose";
import Playlist from "../models/customPlaylistModel.js";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const addTrackToPlaylist = async (req, res) => {
    try {
        const { id, trackId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid playlist ID" });
        }

        const accessToken = await getSpotifyAccessToken(req);
        const spotifyApiUrl = `${SPOTIFY_API_URL}/tracks/${trackId}`;
        const spotifyResponse = await axios.get(spotifyApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const trackDetails = spotifyResponse.data;
        const { name, artists, album, duration_ms, id: spotifyTrackId } = trackDetails;
        const artist = artists.map((a) => a.name).join(", ");
        const albumCoverUrl = album.images[0].url;
        const durationMs = duration_ms;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to add a track to this playlist" });
        }

        const newTrack = {
            spotifyTrackId,
            name,
            artist,
            album: album.name,
            albumCoverUrl,
            durationMs,
        };

        playlist.tracks.push(newTrack);
        playlist.totalDuration += durationMs;

        await playlist.save();
        res.status(200).json(playlist);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in addTrackToPlaylist:", err.message);
    }
};

export { addTrackToPlaylist };