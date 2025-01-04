import mongoose from 'mongoose';
const trackSchema = new mongoose.Schema({
    spotifyTrackId: { type: String, unique: true ,required: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    albumCoverUrl: { type: String, required: true },
    durationMs: { type: Number, required: true }, // Duration in milliseconds
});

const Track = mongoose.model('Track', trackSchema);
export { Track };