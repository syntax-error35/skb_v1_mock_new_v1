/**
 * Tournament Routes - Backend API Endpoints
 * 
 * This file contains commented-out Express.js routes for tournament management.
 * These routes would be used in a production environment with a real database.
 * 
 * Endpoints:
 * - GET /api/tournaments/upcoming - Fetch upcoming tournaments
 * - GET /api/tournaments/:id - Get single tournament details
 * - POST /api/tournaments - Create new tournament (admin only)
 * - PUT /api/tournaments/:id - Update tournament (admin only)
 * - DELETE /api/tournaments/:id - Delete tournament (admin only)
 */

/*
const express = require('express');
const Tournament = require('../models/Tournament');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateTournament } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/tournaments/upcoming
// @desc    Get upcoming tournaments with filtering and pagination
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'upcoming', 
      search,
      organizer 
    } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by organizer
    if (organizer) {
      query.organizer = { $regex: organizer, $options: 'i' };
    }
    
    // Execute query with pagination
    const tournaments = await Tournament.find(query)
      .select('-__v')
      .sort({ date: 1 }) // Sort by date ascending (upcoming first)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('created_by', 'username');

    const total = await Tournament.countDocuments(query);

    // Calculate participant counts (this would be done via aggregation in production)
    const tournamentsWithCounts = await Promise.all(
      tournaments.map(async (tournament) => {
        const participantCount = await Participant.countDocuments({
          tournament_id: tournament._id,
          status: { $ne: 'cancelled' }
        });
        
        return {
          ...tournament.toObject(),
          participant_count: participantCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        items: tournamentsWithCounts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tournaments'
    });
  }
});

// @route   GET /api/tournaments/:id
// @desc    Get single tournament by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .select('-__v')
      .populate('created_by', 'username');
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Get participant count
    const participantCount = await Participant.countDocuments({
      tournament_id: tournament._id,
      status: { $ne: 'cancelled' }
    });

    const tournamentWithCount = {
      ...tournament.toObject(),
      participant_count: participantCount
    };

    res.json({
      success: true,
      data: tournamentWithCount
    });
  } catch (error) {
    console.error('Get tournament error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tournament ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tournament'
    });
  }
});

// @route   POST /api/tournaments
// @desc    Create new tournament
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, validateTournament, async (req, res) => {
  try {
    const tournamentData = {
      ...req.body,
      created_by: req.user._id
    };

    const tournament = new Tournament(tournamentData);
    await tournament.save();
    await tournament.populate('created_by', 'username');

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: {
        ...tournament.toObject(),
        participant_count: 0
      }
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating tournament'
    });
  }
});

// @route   PUT /api/tournaments/:id
// @desc    Update tournament
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validateTournament, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    ).populate('created_by', 'username').select('-__v');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Get participant count
    const participantCount = await Participant.countDocuments({
      tournament_id: tournament._id,
      status: { $ne: 'cancelled' }
    });

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: {
        ...tournament.toObject(),
        participant_count: participantCount
      }
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tournament ID'
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
      message: 'Server error while updating tournament'
    });
  }
});

// @route   DELETE /api/tournaments/:id
// @desc    Delete tournament
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if tournament has participants
    const participantCount = await Participant.countDocuments({
      tournament_id: tournament._id,
      status: { $ne: 'cancelled' }
    });

    if (participantCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete tournament with active participants. Please remove all participants first.'
      });
    }

    await Tournament.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tournament ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tournament'
    });
  }
});

module.exports = router;
*/