const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true,
    maxlength: [100, "Father's name cannot exceed 100 characters"]
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true,
    maxlength: [100, "Mother's name cannot exceed 100 characters"]
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
    trim: true,
    maxlength: [500, 'Present address cannot exceed 500 characters']
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true,
    maxlength: [500, 'Permanent address cannot exceed 500 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{11,15}$/, 'Please enter a valid mobile number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  passportNo: {
    type: String,
    trim: true,
    maxlength: [20, 'Passport number cannot exceed 20 characters']
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  nid: {
    type: String,
    trim: true,
    maxlength: [20, 'NID cannot exceed 20 characters']
  },
  religion: {
    type: String,
    required: [true, 'Religion is required'],
    trim: true,
    maxlength: [50, 'Religion cannot exceed 50 characters']
  },
  profession: {
    type: String,
    required: [true, 'Profession is required'],
    trim: true,
    maxlength: [100, 'Profession cannot exceed 100 characters']
  },
  birthCertificateNo: {
    type: String,
    required: [true, 'Birth certificate number is required'],
    trim: true,
    maxlength: [50, 'Birth certificate number cannot exceed 50 characters']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true,
    default: 'Bangladeshi',
    maxlength: [50, 'Nationality cannot exceed 50 characters']
  },
  photo: {
    type: String, // URL to the uploaded photo
    default: null
  },
  belt: {
    type: String,
    enum: ['White', 'Yellow', 'Orange', 'Green', 'Blue', 'Brown', 'Black Belt (1st Dan)', 'Black Belt (2nd Dan)', 'Black Belt (3rd Dan)', 'Black Belt (4th Dan)', 'Black Belt (5th Dan)'],
    default: 'White'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  achievements: {
    type: String,
    trim: true,
    maxlength: [500, 'Achievements cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  skbId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9]+$/, 'SKB ID can only contain uppercase letters and numbers']
  }
}, {
  timestamps: true
});

// Generate SKB ID before saving
memberSchema.pre('save', async function(next) {
  if (!this.skbId && this.isNew) {
    try {
      const count = await this.constructor.countDocuments();
      this.skbId = `SKB${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);