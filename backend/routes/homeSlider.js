/*
const express = require('express');
const HomeSlider = require('../models/HomeSlider');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateHomeSliderContent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('subtitle')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Subtitle must be between 10 and 500 characters'),
  
  body('slides')
    .isArray({ min: 1, max: 10 })
    .withMessage('Must have between 1 and 10 slides'),
  
  body('slides.*.imageUrl')
    .isURL()
    .withMessage('Each slide must have a valid image URL'),
  
  body('slides.*.altText')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Each slide must have alt text (1-200 characters)'),
  
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

// @route   GET /api/home-slider
// @desc    Get home slider content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let homeSlider = await HomeSlider.findOne().populate('lastUpdatedBy', 'username');
    
    // If no home slider exists, create default one
    if (!homeSlider) {
      homeSlider = new HomeSlider({
        title: 'Shotokan Karate Bangladesh',
        subtitle: 'Empowering minds and bodies through the ancient art of Shotokan Karate. Join our community of dedicated practitioners.',
        slides: [
          {
            imageUrl: 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg',
            altText: 'Championship Training',
            order: 0
          },
          {
            imageUrl: 'https://images.pexels.com/photos/7045694/pexels-photo-7045694.jpeg',
            altText: 'Belt Grading Ceremony',
            order: 1
          },
          {
            imageUrl: 'https://images.pexels.com/photos/7045695/pexels-photo-7045695.jpeg',
            altText: 'National Tournament',
            order: 2
          }
        ],
        lastUpdatedBy: null // This would be set to admin user ID in production
      });
      await homeSlider.save();
    }

    res.json({
      success: true,
      data: homeSlider
    });
  } catch (error) {
    console.error('Get home slider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching home slider content'
    });
  }
});

// @route   PUT /api/home-slider
// @desc    Update home slider content
// @access  Private (Admin only)
router.put('/', authenticate, requireAdmin, validateHomeSliderContent, async (req, res) => {
  try {
    const { title, subtitle, slides } = req.body;
    
    let homeSlider = await HomeSlider.findOne();
    
    // Prepare update data
    const updateData = {
      title,
      subtitle,
      slides: slides.map((slide, index) => ({
        imageUrl: slide.imageUrl,
        altText: slide.altText,
        order: index
      })),
      lastUpdatedBy: req.user._id
    };
    
    if (homeSlider) {
      // Update existing home slider
      Object.assign(homeSlider, updateData);
      await homeSlider.save();
    } else {
      // Create new home slider
      homeSlider = new HomeSlider(updateData);
      await homeSlider.save();
    }
    
    await homeSlider.populate('lastUpdatedBy', 'username');

    res.json({
      success: true,
      message: 'Home slider updated successfully',
      data: homeSlider
    });
  } catch (error) {
    console.error('Update home slider error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating home slider content'
    });
  }
});

module.exports = router;
*/