const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../models/Notice');
const TournamentRegistration = require('../models/TournamentRegistration');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateNotice, validateTournamentRegistration } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, Word documents, and text files are allowed.'), false);
  }
};

// Configure multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5 // Maximum 5 files
  }
});

// @route   GET /api/notices
// @desc    Get all notices
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }

    const notices = await Notice.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(query);

    res.json({
      success: true,
      data: {
        notices,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notices'
    });
  }
});

// @route   GET /api/notices/:id
// @desc    Get single notice
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      data: { notice }
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notice'
    });
  }
});

// @route   POST /api/notices
// @desc    Create new notice
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, upload.array('attachments', 5), validateNotice, async (req, res) => {
  try {
    const { 
      title, 
      content, 
      category, 
      date, 
      endDate,
      location, 
      organizer, 
      contactInfo,
      priority,
      targetAudience,
      rules,
      prizeStructure,
      registrationDeadline,
      maxParticipants
    } = req.body;

    // Process uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
      });
    }

    // Parse targetAudience if it's a string (from form data)
    let parsedTargetAudience = [];
    if (targetAudience) {
      if (typeof targetAudience === 'string') {
        try {
          parsedTargetAudience = JSON.parse(targetAudience);
        } catch (e) {
          parsedTargetAudience = [targetAudience];
        }
      } else if (Array.isArray(targetAudience)) {
        parsedTargetAudience = targetAudience;
      }
    }

    // Create notice object
    const noticeData = {
      title,
      content,
      category,
      date,
      priority: priority || 'medium',
      createdBy: req.user._id,
      attachments
    };

    // Add optional fields if provided
    if (endDate) noticeData.endDate = endDate;
    if (location) noticeData.location = location;
    if (organizer) noticeData.organizer = organizer;
    if (contactInfo) noticeData.contactInfo = contactInfo;
    if (parsedTargetAudience.length > 0) noticeData.targetAudience = parsedTargetAudience;
    
    // Add tournament-specific fields
    if (category === 'tournament') {
      if (rules) noticeData.rules = rules;
      if (prizeStructure) noticeData.prizeStructure = prizeStructure;
      if (registrationDeadline) noticeData.registrationDeadline = registrationDeadline;
      if (maxParticipants) noticeData.maxParticipants = parseInt(maxParticipants);
      noticeData.currentParticipants = 0;
    }

    const notice = new Notice(noticeData);
    
    await notice.save();
    await notice.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Create notice error:', error);
    
    // Clean up uploaded files if notice creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating notice'
    });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update notice
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validateNotice, async (req, res) => {
  try {
    const { title, content, category, date, location, organizer, contactInfo } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Update fields
    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.category = category || notice.category;
    notice.date = date || notice.date;
    notice.location = location || notice.location;
    notice.organizer = organizer || notice.organizer;
    notice.contactInfo = contactInfo || notice.contactInfo;
    notice.updatedAt = Date.now();

    await notice.save();
    await notice.populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notice'
    });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete notice
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notice'
    });
  }
});

// Tournament registration routes

// @route   POST /api/notices/:id/register
// @desc    Register for tournament
// @access  Private
router.post('/:id/register', authenticate, validateTournamentRegistration, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (notice.category !== 'tournament') {
      return res.status(400).json({
        success: false,
        message: 'This notice is not a tournament'
      });
    }

    // Check if registration deadline has passed
    if (notice.registrationDeadline && new Date() > new Date(notice.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if tournament is full
    if (notice.maxParticipants && notice.currentParticipants >= notice.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Tournament is full'
      });
    }

    // Check if user is already registered
    const existingRegistration = await TournamentRegistration.findOne({
      tournament: req.params.id,
      participant: req.user._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this tournament'
      });
    }

    const { teamName, teamMembers, contactNumber } = req.body;

    const registration = new TournamentRegistration({
      tournament: req.params.id,
      participant: req.user._id,
      teamName,
      teamMembers,
      contactNumber
    });

    await registration.save();

    // Update participant count
    notice.currentParticipants += 1;
    await notice.save();

    await registration.populate('participant', 'username email');

    res.status(201).json({
      success: true,
      message: 'Successfully registered for tournament',
      data: { registration }
    });
  } catch (error) {
    console.error('Tournament registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for tournament'
    });
  }
});

// @route   GET /api/notices/:id/registrations
// @desc    Get tournament registrations
// @access  Private (Admin only)
router.get('/:id/registrations', authenticate, requireAdmin, async (req, res) => {
  try {
    const registrations = await TournamentRegistration.find({ tournament: req.params.id })
      .populate('participant', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { registrations }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations'
    });
  }
});

// @route   DELETE /api/notices/:id/register
// @desc    Cancel tournament registration
// @access  Private
router.delete('/:id/register', authenticate, async (req, res) => {
  try {
    const registration = await TournamentRegistration.findOne({
      tournament: req.params.id,
      participant: req.user._id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await TournamentRegistration.findByIdAndDelete(registration._id);

    // Update participant count
    const notice = await Notice.findById(req.params.id);
    if (notice && notice.currentParticipants > 0) {
      notice.currentParticipants -= 1;
      await notice.save();
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling registration'
    });
  }
});

module.exports = router;