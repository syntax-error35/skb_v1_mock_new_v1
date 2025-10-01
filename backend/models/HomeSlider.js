/*
const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  altText: {
    type: String,
    required: [true, 'Alt text is required'],
    trim: true,
    maxlength: [200, 'Alt text cannot exceed 200 characters']
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const homeSliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    maxlength: [500, 'Subtitle cannot exceed 500 characters']
  },
  slides: [slideSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure only one home slider document exists
homeSliderSchema.index({}, { unique: true });

module.exports = mongoose.model('HomeSlider', homeSliderSchema);
*/