// Notice validation rules
const validateNotice = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  body('category')
    .isIn(['notice', 'event', 'tournament'])
    .withMessage('Category must be notice, event, or tournament'),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  // New validation rules for enhanced fields
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),
  
  body('organizer')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Organizer must not exceed 100 characters'),
  
  body('contactInfo')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Contact info must not exceed 300 characters'),
  
  body('targetAudience')
    .optional()
    .isArray()
    .withMessage('Target audience must be an array'),
  
  body('targetAudience.*')
    .optional()
    .isIn(['students', 'faculty', 'staff', 'all'])
    .withMessage('Invalid target audience value'),
  
  // Tournament specific validations
  body('rules')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Rules must not exceed 2000 characters'),
  
  body('prizeStructure')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Prize structure must not exceed 1000 characters'),
  
  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid registration deadline'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be at least 1'),
  
  handleValidationErrors
];