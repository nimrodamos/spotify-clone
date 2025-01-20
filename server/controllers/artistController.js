import Artist from "../models/artistModel.js";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;

const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLimitedArtists = async (req, res) => {
  try {
    const { limit, random } = req.query;

    let artists;
    if (random === "true") {
      const size = parseInt(limit) || 20;
      artists = await Artist.aggregate([{ $sample: { size } }]);
    } else {
      const size = parseInt(limit) || 20;
      artists = await Artist.find({}).limit(size);
    }

    if (!artists || artists.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtistsWithOffset = async (req, res) => {
  try {
    const { offset = 0, limit = 200 } = req.query;

    const artists = await Artist.find({})
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalArtists = await Artist.countDocuments({});
    const hasMore = parseInt(offset) + parseInt(limit) < totalArtists;

    res.status(200).json({
      data: artists,
      total: totalArtists,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtistByName = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const artist = await Artist.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const getArtistBySpotifyUrl = async (req, res) => {
  try {
    const spotifyId = req.params.spotifyUrl;

    console.log("Received Spotify ID:", spotifyId);

    const artist = await Artist.findOne({
      "external_urls.spotify": { $regex: new RegExp(`${spotifyId}$`, "i") },
    });

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getArtists,
  getArtistById,
  getArtistByName,
  getLimitedArtists,
  getArtistsWithOffset,
  getArtistBySpotifyUrl,
};
