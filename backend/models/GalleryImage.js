const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
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
  category: {
    type: String,
    enum: ['training', 'tournament', 'grading', 'event', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);