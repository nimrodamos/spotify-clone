import express from "express";
import {
  getArtists,
  getArtistById,
  getArtistByName,
  getLimitedArtists,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/limited", getLimitedArtists);
router.get("/name/:name", getArtistByName);
router.get("/", getArtists);
router.get("/:id", getArtistById);

export default router;
