import express from 'express';
import {
getArtists,
getArtistById,
} from '../controllers/artistController.js';

const router = express.Router();

router.get('/:id', getArtistById);
router.get('/', getArtists);

export default router;