const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GalleryImage = require('../models/GalleryImage');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// COMMENTED OUT - MULTER CONFIGURATION FOR IMAGE UPLOADS
// TODO: Uncomment when reconnecting to backend
/*
// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/gallery');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
*/

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, isActive } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Execute query with pagination
    const images = await GalleryImage.find(query)
      .populate('uploadedBy', 'username')
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GalleryImage.countDocuments(query);

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery images'
    });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id)
      .populate('uploadedBy', 'username')
      .select('-__v');
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      data: { image }
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching image'
    });
  }
});

// @route   POST /api/gallery
// @desc    Create new gallery image
// @access  Private (Admin only)
// COMMENTED OUT - IMAGE UPLOAD ENDPOINT
// TODO: Uncomment when reconnecting to backend
/*
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, altText, category } = req.body;

    // Basic validation
    if (!title || !altText || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Title, alt text, and image file are required'
      });
    }

    // Generate image URL from uploaded file
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const image = new GalleryImage({
      title,
      description,
      imageUrl,
      altText,
      category: category || 'general',
      uploadedBy: req.user._id
    });
    
    await image.save();
    await image.populate('uploadedBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Image added to gallery successfully',
      data: { image }
    });
  } catch (error) {
    console.error('Create gallery image error:', error);
    
    // Clean up uploaded file if gallery image creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while adding image to gallery'
    });
  }
});
*/

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'username').select('-__v');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: { image }
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating image'
    });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
});

module.exports = router;