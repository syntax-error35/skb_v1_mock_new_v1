const express = require('express');
const Member = require('../models/Member');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateMember } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/members
// @desc    Get all members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, belt, isActive } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skbId: { $regex: search, $options: 'i' } }
      ];
    }
    if (belt) query.belt = belt;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Execute query with pagination
    const members = await Member.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching members'
    });
  }
});

// @route   GET /api/members/:id
// @desc    Get single member
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-__v');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: { member }
    });
  } catch (error) {
    console.error('Get member error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching member'
    });
  }
});

// @route   POST /api/members
// @desc    Create new member
// @access  Public (for registration form)
router.post('/', validateMember, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: { member }
    });
  } catch (error) {
    console.error('Create member error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Member with this email or SKB ID already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating member'
    });
  }
});

// @route   PUT /api/members/:id
// @desc    Update member
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validateMember, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: { member }
    });
  } catch (error) {
    console.error('Update member error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Member with this email or SKB ID already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating member'
    });
  }
});

// @route   DELETE /api/members/:id
// @desc    Delete member
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting member'
    });
  }
});

module.exports = router;