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

const getTracksWithOffset = async (req, res) => {
  try {
    const { offset = 0, limit = 200 } = req.query;

    const tracks = await Track.find({})
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalTracks = await Track.countDocuments({});
    const hasMore = parseInt(offset) + parseInt(limit) < totalTracks;

    res.status(200).json({
      data: tracks,
      total: totalTracks,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

const getTracksByArtist = async (req, res) => {
  try {
    const artistName = decodeURIComponent(req.params.artistName);
    const tracks = await Track.find({
      artist: { $regex: new RegExp(`^${artistName}$`, "i") },
    });

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

export { getTracks, getTrackById, getTracksByArtist, getTracksWithOffset };
