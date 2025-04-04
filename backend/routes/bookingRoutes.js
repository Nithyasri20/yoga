import express from 'express';
import { 
  createBooking, 
  getAvailableSlots, 
  getUserBookings, 
  getTrainerBookings, 
  updateBookingStatus, 
  cancelBooking,
  updateBookingStatusByTrainer
} from '../controllers/bookingControllers.js';
import { protect, trainerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/available', getAvailableSlots);

// Protected routes (require authentication)
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/trainer', protect, getTrainerBookings);
router.put('/:id', protect, updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

// Trainer routes
router.put('/:id/status', protect, trainerOnly, updateBookingStatusByTrainer);

export default router;