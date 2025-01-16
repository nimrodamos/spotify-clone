import express from 'express';
import { fetchTrackDetails, fetchArtistDetails, fetchTracks } from '../controllers/apiCallsController.js';
import { getSpotifyAuthorizationCode, exchangeAuthorizationCodeForTokens } from '../controllers/spotifyController.js';
import { playTrack } from '../controllers/playerController.js'; // Import playTrack function
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Fetch Spotify Data
router.get('/artist/:artistId', fetchArtistDetails);
router.get('/tracks/:trackId', fetchTrackDetails);
router.get('/tracks', fetchTracks);

// Spotify Authorization Code Routes
router.get('/spotify/auth-code', async (req, res) => {
  try {
    const authCode = await getSpotifyAuthorizationCode();
    res.status(200).json({ authCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/spotify/exchange-token', async (req, res) => {
  try {
    const { code } = req.body;
    const tokens = await exchangeAuthorizationCodeForTokens(code);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Play Track Route
router.put('/spotify/play/:spotifyTrackId',protectRoute , playTrack);

export default router;
