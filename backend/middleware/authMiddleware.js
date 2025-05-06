// import jwt from 'jsonwebtoken';
// import User from '../models/userModel.js';
// import Trainer from '../models/trainerModel.js';

// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get user from the token
//       req.user = await User.findById(decoded.id).select('-password');
      
//       // If user not found, check if it's a trainer
//       if (!req.user) {
//         req.user = await Trainer.findById(decoded.id).select('-password');
//         if (req.user) {
//           req.user.role = 'trainer'; // Add role for middleware checks
//         }
//       } else {
//         req.user.role = 'user'; // Add role for middleware checks
//       }

//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// export const trainerOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'trainer') {
//     next();
//   } else {
//     res.status(401);
//     throw new Error('Not authorized as a trainer');
//   }
// };import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Trainer from '../models/trainerModel.js';
import Admin from '../models/adminModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user not found, check if it's a trainer or admin
      if (!req.user) {
        req.user = await Trainer.findById(decoded.id).select('-password');
        if (req.user) {
          req.user.role = 'trainer'; // Add role for middleware checks
        } else {
          req.user = await Admin.findById(decoded.id).select('-password');
          if (req.user) {
            req.user.role = 'admin'; // Add role for middleware checks
          }
        }
      } else {
        req.user.role = 'user'; // Add role for middleware checks
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const trainerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'trainer') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a trainer');
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};