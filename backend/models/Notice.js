const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['notice', 'event', 'tournament'],
    default: 'notice'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    maxlength: 200
  },
  organizer: {
    type: String,
    maxlength: 100
  },
  contactInfo: {
    type: String,
    maxlength: 300
  },
  targetAudience: [{
    type: String,
    enum: ['All Members', 'Beginners', 'Intermediate', 'Advanced', 'Seniors', 'Youth']
  }],
  rules: {
    type: String,
    maxlength: 2000
  },
  prizeStructure: {
    type: String,
    maxlength: 1000
  },
  registrationDeadline: {
    type: Date
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  }],
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
noticeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
noticeSchema.index({ category: 1, date: 1 });
noticeSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);