import Album from "../models/albumModel.js";

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlbumsWithOffset = async (req, res) => {
  try {
    const { offset = 0, limit = 200 } = req.query;

    const albums = await Album.find({})
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalAlbums = await Album.countDocuments({});
    const hasMore = parseInt(offset) + parseInt(limit) < totalAlbums;

    res.status(200).json({
      data: albums,
      total: totalAlbums,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get limited albums
// @route   GET /api/albums/limited
const getLimitedAlbums = async (req, res) => {
  try {
    const { limit, random } = req.query;

    let albums;
    const size = parseInt(limit);
    if (isNaN(size) || size <= 0) {
      return res.status(400).json({ error: "Invalid limit parameter" });
    }

    if (random === "true") {
      albums = await Album.aggregate([{ $sample: { size } }]);
    } else {
      albums = await Album.find({}).limit(size);
    }

    if (!albums || albums.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error.message); // Log errors
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get album by ID
// @route   GET /api/albums/:id
const getAlbumById = async (req, res) => {
  try {
    const { spotifyAlbumId } = req.params;

    const album = await Album.findOne({
      spotifyAlbumId: spotifyAlbumId,
    }).select("-_id");
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getAlbumById:", err.message);
  }
};

// @desc    Get album by name
// @route   GET /api/albums/name/:name
const getAlbumByName = async (req, res) => {
  try {
    const { name } = req.params;

    const album = await Album.findOne({ name: name }).select("-_id");
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getAlbumByName:", err.message);
  }
};

export { getAlbums, getAlbumById, getAlbumByName, getLimitedAlbums, getAlbumsWithOffset };
