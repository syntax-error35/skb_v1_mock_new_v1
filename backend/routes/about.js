/*
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AboutPage = require('../models/AboutPage');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configure multer for banner image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/about');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
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

// Validation middleware
const validateAboutPageContent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }
    next();
  }
];

// @route   GET /api/about
// @desc    Get about page content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let aboutPage = await AboutPage.findOne().populate('lastUpdatedBy', 'username');
    
    // If no about page exists, create default one
    if (!aboutPage) {
      aboutPage = new AboutPage({
        title: 'About Shotokan Karate Bangladesh',
        description: 'Welcome to Shotokan Karate Bangladesh, where tradition meets excellence. Our organization is dedicated to preserving and teaching the authentic art of Shotokan Karate.',
        bannerImageUrl: null,
        lastUpdatedBy: null // This would be set to admin user ID in production
      });
      await aboutPage.save();
    }

    res.json({
      success: true,
      data: aboutPage
    });
  } catch (error) {
    console.error('Get about page error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching about page content'
    });
  }
});

// @route   POST /api/about
// @desc    Update about page content
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, upload.single('bannerImage'), validateAboutPageContent, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    let aboutPage = await AboutPage.findOne();
    
    // Prepare update data
    const updateData = {
      title,
      description,
      lastUpdatedBy: req.user._id,
      lastUpdatedAt: new Date()
    };
    
    // Handle banner image upload
    if (req.file) {
      // Delete old banner image if it exists
      if (aboutPage && aboutPage.bannerImageUrl) {
        const oldImagePath = path.join(__dirname, '../uploads/about', path.basename(aboutPage.bannerImageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.bannerImageUrl = `/uploads/about/${req.file.filename}`;
    }
    
    if (aboutPage) {
      // Update existing about page
      Object.assign(aboutPage, updateData);
      await aboutPage.save();
    } else {
      // Create new about page
      aboutPage = new AboutPage(updateData);
      await aboutPage.save();
    }
    
    await aboutPage.populate('lastUpdatedBy', 'username');

    res.json({
      success: true,
      message: 'About page updated successfully',
      data: aboutPage
    });
  } catch (error) {
    console.error('Update about page error:', error);
    
    // Clean up uploaded file if about page update fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating about page content'
    });
  }
});

module.exports = router;
*/