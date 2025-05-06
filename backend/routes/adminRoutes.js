import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAllUsers,
  getAllTrainers,
  getAllBookings,
  getAllClasses,
  updateTrainerStatus,
  getAnalytics
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (admin only)
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/trainers', protect, adminOnly, getAllTrainers);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.get('/classes', protect, adminOnly, getAllClasses);
router.put('/trainers/:id/approve', protect, adminOnly, updateTrainerStatus);
router.get('/analytics', protect, adminOnly, getAnalytics);

export default router;