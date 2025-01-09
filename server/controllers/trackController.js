import mongoose from "mongoose";
import Playlist from "../models/customPlaylistModel.js";
import { Track } from "../models/trackModel.js";

const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find().select("-_id");
    res.status(200).json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getTracks:", err.message);
  }
};

const getTrackById = async (req, res) => {
  try {
    const { spotifyTrackId } = req.params;

    const track = await Track.findOne({
      spotifyTrackId: spotifyTrackId,
    }).select("-_id");
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.status(200).json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getTrackById:", err.message);
  }
};

// חפש שירים על פי שם האמן
const getTracksByArtist = async (req, res) => {
  try {
    const { artistName } = req.params;

    // חפש שירים של האמן
    const tracks = await Track.find({ artist: artistName });

    if (!tracks || tracks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tracks found for this artist" });
    }

    res.status(200).json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error("Error fetching tracks for artist:", err.message);
  }
};

export { getTracks, getTrackById, getTracksByArtist };
