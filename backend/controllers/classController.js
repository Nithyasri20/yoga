// Path: c:\Users\Nithy\Desktop\yogaflow\backend\controllers\classControllers.js
import Class from '../models/classModel.js';
import Booking from '../models/bookingModel.js';

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private/Trainer
export const createClass = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, sessionType, capacity, zoomLink } = req.body;
    
    const newClass = await Class.create({
      trainer: req.user._id,
      title,
      description,
      date,
      startTime,
      endTime,
      sessionType,
      capacity: capacity || 10,
      zoomLink: sessionType === 'online' ? zoomLink : null
    });
    
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error in createClass:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all classes for a trainer
// @route   GET /api/classes/trainer
// @access  Private/Trainer
export const getTrainerClasses = async (req, res) => {
  try {
    const classes = await Class.find({ trainer: req.user._id })
      .sort({ date: 1, startTime: 1 });
    
    res.json(classes);
  } catch (error) {
    console.error('Error in getTrainerClasses:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available classes for users
// @route   GET /api/classes/available
// @access  Public
export const getAvailableClasses = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const classes = await Class.find({ 
      date: { $gte: today },
      isAvailable: true 
    })
      .populate('trainer', 'name specialization experience')
      .sort({ date: 1, startTime: 1 });
    
    res.json(classes);
  } catch (error) {
    console.error('Error in getAvailableClasses:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private/Trainer
export const updateClass = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, sessionType, capacity, zoomLink, isAvailable } = req.body;
    
    const classToUpdate = await Class.findById(req.params.id);
    
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Check if trainer is authorized to update this class
    if (classToUpdate.trainer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this class' });
    }
    
    // Update class fields
    classToUpdate.title = title || classToUpdate.title;
    classToUpdate.description = description || classToUpdate.description;
    classToUpdate.date = date || classToUpdate.date;
    classToUpdate.startTime = startTime || classToUpdate.startTime;
    classToUpdate.endTime = endTime || classToUpdate.endTime;
    classToUpdate.sessionType = sessionType || classToUpdate.sessionType;
    classToUpdate.capacity = capacity || classToUpdate.capacity;
    classToUpdate.isAvailable = isAvailable !== undefined ? isAvailable : classToUpdate.isAvailable;
    
    if (sessionType === 'online') {
      classToUpdate.zoomLink = zoomLink || classToUpdate.zoomLink;
    }
    
    const updatedClass = await classToUpdate.save();
    
    res.json(updatedClass);
  } catch (error) {
    console.error('Error in updateClass:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private/Trainer
export const deleteClass = async (req, res) => {
  try {
    const classToDelete = await Class.findById(req.params.id);
    
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Check if trainer is authorized to delete this class
    if (classToDelete.trainer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this class' });
    }
    
    // Check if there are any bookings for this class
    const bookings = await Booking.find({ 
      trainer: req.user._id,
      date: classToDelete.date,
      time: classToDelete.startTime
    });
    
    if (bookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete class with existing bookings. Please cancel all bookings first.' 
      });
    }
    
    await classToDelete.deleteOne();
    
    res.json({ message: 'Class removed successfully' });
  } catch (error) {
    console.error('Error in deleteClass:', error);
    res.status(500).json({ message: error.message });
  }
};