import express from "express";
import {
  getTracks,
  getTrackById,
  getTracksByArtist,
} from "../controllers/trackController.js";

const router = express.Router();

router.get("/:spotifyTrackId", getTrackById);
router.get("/", getTracks);
router.get("/artist/:artistName", getTracksByArtist);

export default router;
