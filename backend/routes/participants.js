/**
 * Participants Routes - Backend API Endpoints
 * 
 * This file contains commented-out Express.js routes for participant management.
 * These routes would be used in a production environment with a real database.
 * 
 * Endpoints:
 * - GET /api/tournaments/:tournamentId/participants - Get tournament participants
 * - POST /api/tournaments/:tournamentId/participants - Add participant to tournament
 * - PUT /api/participants/:id - Update participant status
 * - DELETE /api/participants/:id - Remove participant from tournament
 */

/*
const express = require('express');
const Participant = require('../models/Participant');
const Tournament = require('../models/Tournament');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateParticipant } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/tournaments/:tournamentId/participants
// @desc    Get participants for a specific tournament
// @access  Private (Admin only)
router.get('/tournaments/:tournamentId/participants', authenticate, requireAdmin, async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status,
      search,
      belt_level,
      age_category,
      weight_category
    } = req.query;
    
    // Verify tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }
    
    // Build query object
    const query = { tournament_id: tournamentId };
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skb_id: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by belt level
    if (belt_level && belt_level !== 'all') {
      query.belt_level = belt_level;
    }
    
    // Filter by age category
    if (age_category && age_category !== 'all') {
      query.age_category = age_category;
    }
    
    // Filter by weight category
    if (weight_category && weight_category !== 'all') {
      query.weight_category = weight_category;
    }
    
    // Execute query with pagination
    const participants = await Participant.find(query)
      .select('-__v')
      .sort({ registration_date: -1 }) // Sort by registration date (newest first)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Participant.countDocuments(query);

    res.json({
      success: true,
      data: {
        items: participants,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get participants error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tournament ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching participants'
    });
  }
});

// @route   POST /api/tournaments/:tournamentId/participants
// @desc    Add participant to tournament
// @access  Public (for registration form) or Private (Admin)
router.post('/tournaments/:tournamentId/participants', validateParticipant, async (req, res) => {
  try {
    const { tournamentId } = req.params;
    
    // Verify tournament exists and is accepting registrations
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }
    
    // Check if tournament is still accepting registrations
    if (tournament.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Tournament registration is closed'
      });
    }
    
    // Check registration deadline
    if (tournament.registration_deadline && new Date() > new Date(tournament.registration_deadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }
    
    // Check if tournament is full
    if (tournament.max_participants) {
      const currentParticipants = await Participant.countDocuments({
        tournament_id: tournamentId,
        status: { $ne: 'cancelled' }
      });
      
      if (currentParticipants >= tournament.max_participants) {
        return res.status(400).json({
          success: false,
          message: 'Tournament is full'
        });
      }
    }
    
    // Check if participant is already registered
    const existingParticipant = await Participant.findOne({
      tournament_id: tournamentId,
      $or: [
        { email: req.body.email },
        { skb_id: req.body.skb_id }
      ],
      status: { $ne: 'cancelled' }
    });
    
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Participant is already registered for this tournament'
      });
    }
    
    // Create new participant
    const participant = new Participant({
      ...req.body,
      tournament_id: tournamentId,
      registration_date: new Date(),
      status: 'registered'
    });
    
    await participant.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: participant
    });
  } catch (error) {
    console.error('Add participant error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Participant with this email or SKB ID already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   PUT /api/participants/:id
// @desc    Update participant status or details
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.json({
      success: true,
      message: 'Participant updated successfully',
      data: participant
    });
  } catch (error) {
    console.error('Update participant error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating participant'
    });
  }
});

// @route   DELETE /api/participants/:id
// @desc    Remove participant from tournament
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.json({
      success: true,
      message: 'Participant removed successfully'
    });
  } catch (error) {
    console.error('Delete participant error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while removing participant'
    });
  }
});

// @route   GET /api/participants/:id
// @desc    Get single participant details
// @access  Private (Admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
      .select('-__v')
      .populate('tournament_id', 'name date location');
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.json({
      success: true,
      data: participant
    });
  } catch (error) {
    console.error('Get participant error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching participant'
    });
  }
});

module.exports = router;
*/