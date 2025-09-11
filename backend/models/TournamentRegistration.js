const mongoose = require('mongoose');

const tournamentRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
  },
  skbId: {
    type: String,
    required: [true, 'SKB ID is required'],
    trim: true,
    uppercase: true,
    minlength: [3, 'SKB ID must be at least 3 characters'],
    maxlength: [20, 'SKB ID cannot exceed 20 characters'],
    match: [/^[A-Z0-9]+$/, 'SKB ID can only contain uppercase letters and numbers']
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice',
    required: [true, 'Tournament ID is required']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'cancelled'],
    default: 'registered'
  }
}, {
  timestamps: true
});

// Ensure unique registration per tournament
tournamentRegistrationSchema.index({ skbId: 1, tournamentId: 1 }, { unique: true });

module.exports = mongoose.model('TournamentRegistration', tournamentRegistrationSchema);