import Artist from "../models/artistModel.js";
import { EventEmitter } from 'events';

// Increase the maximum number of listeners
EventEmitter.defaultMaxListeners = 20;

// Get all artists
const getArtists = async (req, res) => {
    try {
        const artists = await Artist.find();
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get artist by ID
const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getArtists, getArtistById };