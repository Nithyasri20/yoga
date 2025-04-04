import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfilePicture } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/picture', protect, uploadProfilePicture);

export default router;