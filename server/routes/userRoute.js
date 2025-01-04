import express from 'express';
import  protectRoute  from '../middleware/protectRoute.js';
import {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/:id/follow', protectRoute, followUnFollowUser);
router.put('/:id',protectRoute ,updateUser);
router.get('/:query', getUserProfile); // so you also can get users by name

export default router;
