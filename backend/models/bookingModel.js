import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Trainer'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  classType: {
    type: String,
    required: true,
    enum: ['online', 'in-person']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  zoomLink: {
    type: String
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;