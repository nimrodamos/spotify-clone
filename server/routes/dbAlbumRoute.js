import express from "express";
import {
  getAlbums,
  getAlbumById,
  getAlbumByName,
  getLimitedAlbums,
  getAlbumsWithOffset,
} from "../controllers/albumController.js";

const router = express.Router();

router.get("/limited", getLimitedAlbums);
router.get("/name/:name", getAlbumByName);
router.get("/", getAlbums);
router.get("/offset", getAlbumsWithOffset);
router.get("/:spotifyAlbumId", getAlbumById);

export default router;
