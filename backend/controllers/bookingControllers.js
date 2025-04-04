import Booking from '../models/bookingModel.js';
import Trainer from '../models/trainerModel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { trainer, date, time, classType } = req.body;
    
    // Check if the time slot is available
    const existingBooking = await Booking.findOne({
      trainer,
      date: new Date(date),
      time,
      status: { $ne: 'Cancelled' }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Create new booking
    const booking = await Booking.create({
      user: req.user._id,
      trainer,
      date,
      time,
      classType,
      status: 'Pending'
    });
    
    if (booking) {
      const populatedBooking = await Booking.findById(booking._id)
        .populate('trainer', 'name specialization')
        .populate('user', 'name email');
      
      res.status(201).json(populatedBooking);
    } else {
      res.status(400).json({ message: 'Invalid booking data' });
    }
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available time slots for a trainer on a specific date
// @route   GET /api/bookings/available
// @access  Public
export const getAvailableSlots = async (req, res) => {
  try {
    const { trainer, date } = req.query;
    
    console.log('Query params:', req.query);
    console.log('Trainer:', trainer);
    console.log('Date:', date);
    
    if (!trainer || !date) {
      return res.status(400).json({ message: 'Trainer ID and date are required' });
    }
    
    // Define available time slots (9 AM to 5 PM)
    const allTimeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    // Find bookings for the trainer on the specified date
    // Create date objects for the start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const bookings = await Booking.find({
      trainer,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'Cancelled' }
    });
    
    console.log('Bookings found:', bookings);
    
    // Get booked time slots
    const bookedSlots = bookings.map(booking => booking.time);
    
    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    
    console.log('Available slots:', availableSlots);
    
    res.json(availableSlots);
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trainer', 'name specialization')
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a trainer
// @route   GET /api/bookings/trainer
// @access  Private/Trainer
export const getTrainerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ trainer: req.user._id })
      .populate('user', 'name email')
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error in getTrainerBookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, zoomLink } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    // Only the user who made the booking or the trainer can update it
    if (
      booking.user.toString() !== req.user._id.toString() && 
      booking.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }
    
    // Update booking
    booking.status = status || booking.status;
    
    // If class type is online and status is confirmed, add Zoom link
    if (booking.classType === 'online' && status === 'Confirmed' && zoomLink) {
      booking.zoomLink = zoomLink;
    }
    
    const updatedBooking = await booking.save();
    
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('trainer', 'name specialization')
      .populate('user', 'name email');
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already confirmed and less than 24 hours away
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    if (booking.status === 'Confirmed' && hoursDiff < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel a confirmed booking less than 24 hours before the scheduled time' 
      });
    }
    
    // Delete the booking from the database
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Public
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).select('-password');
    res.json(trainers);
  } catch (error) {
    console.error('Error in getAllTrainers:', error);
    res.status(500).json({ message: error.message });
  }
};// @desc    Accept or reject a booking
// @route   PUT /api/bookings/:id/status
// @access  Private/Trainer
export const updateBookingStatusByTrainer = async (req, res) => {
  try {
    const { status, zoomLink } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if trainer is authorized to update this booking
    if (booking.trainer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }
    
    // Update booking status
    booking.status = status;
    
    // If class type is online and status is confirmed, add Zoom link
    if (booking.classType === 'online' && status === 'Confirmed' && zoomLink) {
      booking.zoomLink = zoomLink;
    }
    
    const updatedBooking = await booking.save();
    
    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('trainer', 'name specialization')
      .populate('user', 'name email');
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error in updateBookingStatusByTrainer:', error);
    res.status(500).json({ message: error.message });
  }
};