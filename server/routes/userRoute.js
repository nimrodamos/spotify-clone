import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile,
    upgradeToPremium,
    validateEmail,
} from '../controllers/userController.js';

const router = express.Router();

// Define specific routes first
router.get('/validate-email', validateEmail);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/premium', upgradeToPremium);
router.post('/logout', logoutUser);
router.post('/:id/follow', protectRoute, followUnFollowUser);
router.put('/:id', protectRoute, updateUser);

// Define generic routes last
router.get('/:query', getUserProfile); // Get users by name or other queries

export default router;
