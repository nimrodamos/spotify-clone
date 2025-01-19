import express from "express";
import {
  getTracks,
  getTrackById,
  getTracksByArtist,
  getTracksWithOffset,
} from "../controllers/trackController.js";
// import populateTracksDb from "../db/populateDb.js";
// import { populateAlbumsFromTracks } from "../db/populateDb.js";

const router = express.Router();

router.get("/offset", getTracksWithOffset);
router.get("/:spotifyTrackId", getTrackById);
router.get("/", getTracks);
router.get("/artist/:artistName", getTracksByArtist);

export default router;
