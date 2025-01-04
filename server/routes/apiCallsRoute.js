import express from 'express';
import { fetchTrackDetails, fetchArtistDetails, fetchTracks } from '../controllers/apiCallsController.js';
// import populateAlbumsDb from '../db/populateDb.js';
// import  populateDb  from '../db/populateDb.js';

const router = express.Router();

router.get('/artist/:artistId', fetchArtistDetails);
router.get('/tracks/:trackId', fetchTrackDetails);
router.get('/tracks', fetchTracks);
// router.get('/tracks/populate', populateAlbumsDb);

export default router;
