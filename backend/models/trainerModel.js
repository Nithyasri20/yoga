import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  certifications: {
    type: String
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    default: 'trainer'
  }
}, {
  timestamps: true
});

// Hash password before saving
trainerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
trainerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;