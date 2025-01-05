import express from 'express';
import {
getAlbums,
getAlbumById,
} from '../controllers/albumController.js';

const router = express.Router();

router.get('/:spotifyAlbumId', getAlbumById);
router.get('/', getAlbums);

export default router;