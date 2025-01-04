import Playlist from "../models/customPlaylistModel.js";
import mongoose from "mongoose";

const createPlaylist = async (req, res) => {
	try {
		const { PlaylistTitle, description, tracks, customAlbumCover, isPublic } = req.body;
		const owner = req.user._id;

		const newPlaylist = new Playlist({
			PlaylistTitle,
			description,
			owner,
			tracks,
			customAlbumCover,
			isPublic,
			totalDuration: tracks.reduce((acc, track) => acc + track.duration, 0),
		});

		await newPlaylist.save();
		res.status(201).json(newPlaylist);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in createPlaylist: ", err.message);
	}
};

const getPlaylistById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid playlist ID" });
		}

		const playlist = await Playlist.findById(id).populate("owner", "name");
		if (!playlist) {
			return res.status(404).json({ error: "Playlist not found" });
		}

		res.status(200).json(playlist);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getPlaylistById: ", err.message);
	}
};

const updatePlaylist = async (req, res) => {
	try {
		const { id } = req.params;
		const { PlaylistTitle, description, tracks, customAlbumCover, isPublic } = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid playlist ID" });
		}

		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({ error: "Playlist not found" });
		}

		if (playlist.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ error: "You are not authorized to update this playlist" });
		}

		playlist.PlaylistTitle = PlaylistTitle || playlist.PlaylistTitle;
		playlist.description = description || playlist.description;
		playlist.tracks = tracks || playlist.tracks;
		playlist.customAlbumCover = customAlbumCover || playlist.customAlbumCover;
		playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;
		playlist.totalDuration = tracks ? tracks.reduce((acc, track) => acc + track.duration, 0) : playlist.totalDuration;

		await playlist.save();
		res.status(200).json(playlist);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updatePlaylist: ", err.message);
	}
};

const deletePlaylist = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: "Invalid playlist ID" });
		}

		const playlist = await Playlist.findById(id);
		if (!playlist) {
			return res.status(404).json({ error: "Playlist not found" });
		}

		if (playlist.owner.toString() !== req.user._id.toString()) {
			return res.status(403).json({ error: "You are not authorized to delete this playlist" });
		}

		await playlist.remove();
		res.status(200).json({ message: "Playlist deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in deletePlaylist: ", err.message);
	}
};

const getPublicPlaylists = async (req, res) => {
	try {
		const playlists = await Playlist.find({ isPublic: true }).populate("owner", "username");
		res.status(200).json(playlists);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getPublicPlaylists: ", err.message);
	}
};


export {
	createPlaylist,
	getPlaylistById,
	updatePlaylist,
	deletePlaylist,
	getPublicPlaylists,
};
