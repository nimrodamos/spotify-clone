import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
    {
        spotifyAlbumId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: String,
            required: true,
        },
        totalTracks: {
            type: Number,
            required: true,
        },
        genres: {
            type: [String],
            default: [],
        },
        albumCoverUrl: {
            type: String,
            required: true,
        },
        spotifyUrl: {
            type: String,
            required: true,
        },
        popularity: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Album = mongoose.model("Album", albumSchema);

export default Album;
