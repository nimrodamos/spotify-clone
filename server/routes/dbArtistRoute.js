import express from "express";
import {
  getArtists,
  getArtistById,
  getArtistByName,
  getLimitedArtists,
  getArtistsWithOffset,
  getArtistBySpotifyUrl,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/limited", getLimitedArtists);
router.get("/name/:name", getArtistByName);
router.get("/", getArtists);
router.get("/offset", getArtistsWithOffset);
router.get("/:id", getArtistById);
router.get("/spotify/:spotifyUrl", getArtistBySpotifyUrl);

export default router;
