// Path: c:\Users\Nithy\Desktop\yogaflow\backend\routes\classRoutes.js
import express from 'express';
import { 
  createClass, 
  getTrainerClasses, 
  getAvailableClasses, 
  updateClass, 
  deleteClass 
} from '../controllers/classController.js';
import { protect, trainerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/available', getAvailableClasses);

// Protected routes (require trainer authentication)
router.post('/', protect, trainerOnly, createClass);
router.get('/trainer', protect, trainerOnly, getTrainerClasses);
router.put('/:id', protect, trainerOnly, updateClass);
router.delete('/:id', protect, trainerOnly, deleteClass);

export default router;