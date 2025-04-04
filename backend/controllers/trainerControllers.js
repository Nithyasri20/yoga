import Trainer from '../models/trainerModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new trainer
// @route   POST /api/trainers
// @access  Public
export const registerTrainer = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, certifications, bio } = req.body;

    // Check if trainer already exists
    const trainerExists = await Trainer.findOne({ email });
    if (trainerExists) {
      return res.status(400).json({ message: 'Trainer already exists' });
    }

    // Create new trainer
    const trainer = await Trainer.create({
      name,
      email,
      password,
      specialization,
      experience,
      certifications,
      bio
    });

    if (trainer) {
      res.status(201).json({
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        specialization: trainer.specialization,
        experience: trainer.experience,
        token: generateToken(trainer._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid trainer data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth trainer & get token
// @route   POST /api/trainers/login
// @access  Public
export const loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find trainer by email
    const trainer = await Trainer.findOne({ email });

    // Check if trainer exists and password matches
    if (trainer && (await trainer.matchPassword(password))) {
      res.json({
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        specialization: trainer.specialization,
        experience: trainer.experience,
        token: generateToken(trainer._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer profile
// @route   GET /api/trainers/profile
// @access  Private
export const getTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user._id);

    if (trainer) {
      res.json({
        _id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        specialization: trainer.specialization,
        experience: trainer.experience,
        certifications: trainer.certifications,
        bio: trainer.bio
      });
    } else {
      res.status(404).json({ message: 'Trainer not found' });
    }
  } catch (error) {
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
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};