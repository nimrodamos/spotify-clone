import Album from '../models/albumModel.js';

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

// @desc    Get album by ID
// @route   GET /api/albums/:id
const getAlbumById = async (req, res) => {
    try {
        const { spotifyAlbumId } = req.params;

        const album = await Album.findOne({ spotifyAlbumId: spotifyAlbumId }).select('-_id');
        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }

        res.status(200).json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getAlbumById:", err.message);
}
};

export {
    getAlbums,
    getAlbumById
};