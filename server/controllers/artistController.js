import Artist from "../models/artistModel.js";
import { EventEmitter } from "events";

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

// Get limited artists
const getLimitedArtists = async (req, res) => {
  try {
    const { limit, random } = req.query;

    let artists;
    if (random === "true") {
      const size = parseInt(limit) || 20;
      artists = await Artist.aggregate([{ $sample: { size } }]); // אמנים רנדומליים
    } else {
      const size = parseInt(limit) || 20;
      artists = await Artist.find({}).limit(size); // אמנים מוגבלים לפי limit
    }

    if (!artists || artists.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get artist by name
const getArtistByName = async (req, res) => {
  try {
    const artist = await Artist.findOne({ name: req.params.name });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get artist by ID
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getArtists, getArtistById, getArtistByName, getLimitedArtists };
