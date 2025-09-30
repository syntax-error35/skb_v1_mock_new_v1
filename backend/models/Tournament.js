const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    maxlength: 200
  },
  organizer: {
    type: String,
    required: true,
    maxlength: 100
  },
  contactInfo: {
    type: String,
    maxlength: 300
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  entryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  prizeStructure: {
    type: String,
    maxlength: 1000
  },
  rules: {
    type: String,
    maxlength: 2000
  },
  format: {
    type: String,
    enum: ['Swiss', 'Round Robin', 'Knockout', 'Arena'],
    default: 'Swiss'
  },
  timeControl: {
    type: String,
    maxlength: 100
  },
  skillLevels: [{
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  }],
  ageGroups: [{
    type: String,
    enum: ['Youth (Under 18)', 'Adult (18-59)', 'Senior (60+)', 'All Ages']
  }],
  status: {
    type: String,
    enum: ['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
tournamentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that end date is after start date
tournamentSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Validate that registration deadline is before start date
tournamentSchema.pre('save', function(next) {
  if (this.registrationDeadline >= this.startDate) {
    next(new Error('Registration deadline must be before tournament start date'));
  } else {
    next();
  }
});

// Index for better query performance
tournamentSchema.index({ startDate: 1, status: 1 });
tournamentSchema.index({ registrationDeadline: 1 });
tournamentSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Tournament', tournamentSchema);