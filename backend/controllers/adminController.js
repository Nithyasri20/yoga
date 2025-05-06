import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Trainer from '../models/trainerModel.js';
import Booking from '../models/bookingModel.js';
import Class from '../models/classModel.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new admin
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate an admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all trainers
// @route   GET /api/admin/trainers
// @access  Private/Admin
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).select('-password');
    res.json(trainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('trainer', 'name email')
      .populate('class', 'title date time');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all classes
// @route   GET /api/admin/classes
// @access  Private/Admin
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({}).populate('trainer', 'name email');
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update trainer approval status
// @route   PUT /api/admin/trainers/:id/approve
// @access  Private/Admin
export const updateTrainerStatus = async (req, res) => {
  try {
    const { approved } = req.body;
    
    const trainer = await Trainer.findById(req.params.id);
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    trainer.approved = approved;
    await trainer.save();
    
    res.json({ message: `Trainer ${approved ? 'approved' : 'rejected'}`, trainer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const approvedTrainerCount = await Trainer.countDocuments({ approved: true });
    const pendingTrainerCount = await Trainer.countDocuments({ approved: false });
    const classCount = await Class.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Get recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');
    
    // Get recent bookings
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('trainer', 'name')
      .populate('class', 'title');
    
    // Get class type distribution
    const onlineClassCount = await Class.countDocuments({ sessionType: 'online' });
    const inPersonClassCount = await Class.countDocuments({ sessionType: 'in-person' });
    
    // Calculate revenue (assuming each booking costs $20)
    const totalRevenue = bookingCount * 20;
    
    // Get monthly booking data for the past 6 months
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Format monthly data
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const found = monthlyBookings.find(
        item => item._id.year === year && item._id.month === month
      );
      
      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        year: year,
        bookings: found ? found.count : 0,
        revenue: (found ? found.count : 0) * 20
      });
    }
    
    res.json({
      counts: {
        users: userCount,
        trainers: trainerCount,
        approvedTrainers: approvedTrainerCount,
        pendingTrainers: pendingTrainerCount,
        classes: classCount,
        bookings: bookingCount,
      },
      classDistribution: {
        online: onlineClassCount,
        inPerson: inPersonClassCount
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyData
      },
      recent: {
        users: recentUsers,
        bookings: recentBookings
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};