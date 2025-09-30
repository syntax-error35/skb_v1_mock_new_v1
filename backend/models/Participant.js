const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  age: {
    type: Number,
    min: 5,
    max: 120
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  notice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'cancelled', 'completed'],
    default: 'registered'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  emergencyContact: {
    name: {
      type: String,
      maxlength: 100
    },
    phone: {
      type: String,
      maxlength: 20
    },
    relationship: {
      type: String,
      maxlength: 50
    }
  },
  medicalInfo: {
    type: String,
    maxlength: 500
  },
  specialRequirements: {
    type: String,
    maxlength: 300
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
participantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for unique participant per tournament
participantSchema.index({ email: 1, tournament: 1 }, { unique: true });

// Index for better query performance
participantSchema.index({ tournament: 1, status: 1 });
participantSchema.index({ registrationDate: -1 });

module.exports = mongoose.model('Participant', participantSchema);