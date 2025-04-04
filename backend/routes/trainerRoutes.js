import express from 'express';
import { registerTrainer, loginTrainer, getTrainerProfile, getAllTrainers } from '../controllers/trainerControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerTrainer);
router.post('/login', loginTrainer);
router.get('/profile', protect, getTrainerProfile);
router.get('/', getAllTrainers);

export default router;