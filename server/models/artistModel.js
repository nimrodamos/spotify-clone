import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        default: []
    },
    popularity: {
        type: Number,
        default: 0
    },
    followers: {
        href: {
            type: String,
            default: null
        },
        total: {
            type: Number,
            default: 0
        }
    },
    images: [
        {
            height: {
                type: Number,
                default: null
            },
            url: {
                type: String,
                required: true
            },
            width: {
                type: Number,
                default: null
            }
        }
    ],
    external_urls: {
        spotify: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;