/**
 * TherapistRequest Model
 * Stores therapist consultation requests from users
 */

const mongoose = require('mongoose');

const therapistRequestSchema = new mongoose.Schema({
  preferredMethod: {
    type: String,
    enum: ['video', 'phone', 'in-person', 'any'],
    required: [true, 'Preferred consultation method is required'],
  },
  timeAvailability: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'any'],
    required: [true, 'Time availability is required'],
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters'],
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  userName: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // We're using createdAt manually
});

// Index for faster querying
therapistRequestSchema.index({ createdAt: -1 });
therapistRequestSchema.index({ userEmail: 1 });

const TherapistRequest = mongoose.model('TherapistRequest', therapistRequestSchema);

module.exports = TherapistRequest;

