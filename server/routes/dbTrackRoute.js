import express from 'express';
import {
getTracks,
getTrackById,
} from '../controllers/trackController.js';

const router = express.Router();

router.get('/:spotifyTrackId', getTrackById);
router.get('/', getTracks);

export default router;