import express from "express";
import {
  getArtists,
  getArtistById,
  getArtistByName,
  getLimitedArtists,
  getArtistsWithOffset,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/limited", getLimitedArtists);
router.get("/name/:name", getArtistByName);
router.get("/", getArtists);
router.get("/offset", getArtistsWithOffset);
router.get("/:id", getArtistById);

export default router;
