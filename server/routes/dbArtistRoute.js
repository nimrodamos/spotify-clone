import express from 'express';
import {
getArtists,
getArtistById,
getArtistByName,
} from '../controllers/artistController.js';

const router = express.Router();

router.get('/:id', getArtistById);
router.get('/name/:name', getArtistByName);
router.get('/', getArtists);

export default router;