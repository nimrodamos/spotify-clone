import express from 'express';
import {
getAlbums,
getAlbumById,
getAlbumByName,
} from '../controllers/albumController.js';

const router = express.Router();

router.get('/:spotifyAlbumId', getAlbumById);
router.get('/name/:name', getAlbumByName);
router.get('/', getAlbums);

export default router;