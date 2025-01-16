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


router.get('/validate-email', validateEmail);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/premium', upgradeToPremium);
router.post('/logout', logoutUser);
router.post('/:id/follow', protectRoute, followUnFollowUser);
router.put('/:id', protectRoute, updateUser);

router.get('/:query', getUserProfile);

export default router;
