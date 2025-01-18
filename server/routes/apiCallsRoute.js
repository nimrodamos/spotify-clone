import express from 'express';
import {
    fetchTrackDetails,
    fetchArtistDetails,
    fetchTracks,
} from '../controllers/apiCallsController.js';
import {
    getSpotifyAuthorizationCode,
    exchangeAuthorizationCode,
    refreshTokenMiddleware,
    fetchSpotifyData,
} from '../controllers/spotifyController.js';
import {
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    shuffleTracks,
    queueTrack,
    resumeTrack,
} from '../controllers/playerController.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/artist/:artistId', fetchArtistDetails);
router.get('/tracks/:trackId', fetchTrackDetails);
router.get('/tracks', fetchTracks);

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
        const tokens = await exchangeAuthorizationCode(code);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/test-refresh" ,protectRoute, refreshTokenMiddleware, fetchSpotifyData);


router.put('/spotify/play/:spotifyTrackId', protectRoute, playTrack);
router.put('/spotify/pause', protectRoute, pauseTrack);
router.post('/spotify/next', protectRoute, nextTrack);
router.post('/spotify/previous', protectRoute, previousTrack);
router.put('/spotify/shuffle', protectRoute, shuffleTracks);
router.put('/spotify/resume', protectRoute, resumeTrack);
router.post('/spotify/queue/:spotifyTrackId', protectRoute, queueTrack);

export default router;
