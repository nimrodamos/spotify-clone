import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    PlaylistTitle: { type: String, required: true }, // Playlist title
    description: { type: String, default: 'My Playlist' }, // Optional description
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the playlist owner
    tracks: [
    {
        spotifyTrackId: { type: String, required: true }, // ID of the song in Spotify's API
        name: { type: String, required: true },
        artist: { type: String, required: true }, // Artist name
        album: { type: String, required: true },
        albumCoverUrl: { type: String, required: true },
        durationMs: { type: Number, required: true }, // Song duration in seconds
        addedAt: { type: Date, default: Date.now }, // When the song was added
        },
    ],
    customAlbumCover: { type: String }, // URL of the album cover (selected from the songs list)
    totalDuration: { type: Number, default: 0 }, // Total duration of all songs in seconds
    isPublic: { type: Boolean, default: true }, // Public visibility flag
    createdAt: { type: Date, default: Date.now }, // Playlist creation date
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;