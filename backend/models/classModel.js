// Path: c:\Users\Nithy\Desktop\yogaflow\backend\models\classModel.js
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trainer'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['online', 'in-person']
  },
  capacity: {
    type: Number,
    default: 10
  },
  zoomLink: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Class = mongoose.model('Class', classSchema);

export default Class;