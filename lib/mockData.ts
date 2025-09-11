// MOCK DATA SERVICE - TEMPORARY REPLACEMENT FOR BACKEND API CALLS
// This file contains all mock data and functions to simulate API responses
// TODO: Remove this file when reconnecting to actual backend

export interface MockMember {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  belt: string;
  skbId: string;
  joinDate: string;
  isActive: boolean;
  dateOfBirth: string;
  gender: string;
  profession: string;
  fatherName: string;
  motherName: string;
  presentAddress: string;
  permanentAddress: string;
  passportNo?: string;
  bloodGroup: string;
  nid?: string;
  religion: string;
  birthCertificateNo: string;
  nationality: string;
  photo?: string;
  achievements?: string;
}

export interface MockNotice {
  _id: string;
  title: string;
  content: string;
  category: 'notice' | 'event' | 'tournament';
  date: string;
  createdAt: string;
  location?: string;
  organizer?: string;
  contactInfo?: string;
  rules?: string;
  prizeStructure?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  isActive: boolean;
  createdBy: {
    username: string;
  };
}

export interface MockGalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  uploadedBy: {
    username: string;
  };
}

export interface MockDashboardStats {
  totalMembers: number;
  totalNotices: number;
  totalEvents: number;
  totalTournaments: number;
  totalGalleryImages: number;
  recentRegistrations: number;
}

// Mock Members Data
const mockMembers: MockMember[] = [
  {
    _id: '1',
    name: 'Md. Kamal Hossain',
    email: 'kamal@example.com',
    mobile: '01712345678',
    belt: 'Black Belt (3rd Dan)',
    skbId: 'SKB0001',
    joinDate: '2018-01-15T00:00:00.000Z',
    isActive: true,
    dateOfBirth: '1985-03-20T00:00:00.000Z',
    gender: 'male',
    profession: 'Engineer',
    fatherName: 'Md. Abdul Hossain',
    motherName: 'Fatima Begum',
    presentAddress: '123 Dhanmondi, Dhaka',
    permanentAddress: '456 Comilla, Bangladesh',
    bloodGroup: 'B+',
    religion: 'Islam',
    birthCertificateNo: 'BC123456789',
    nationality: 'Bangladeshi',
    achievements: 'National Champion 2022'
  },
  {
    _id: '2',
    name: 'Fatima Rahman',
    email: 'fatima@example.com',
    mobile: '01798765432',
    belt: 'Black Belt (1st Dan)',
    skbId: 'SKB0002',
    joinDate: '2020-03-10T00:00:00.000Z',
    isActive: true,
    dateOfBirth: '1992-07-15T00:00:00.000Z',
    gender: 'female',
    profession: 'Teacher',
    fatherName: 'Abdul Rahman',
    motherName: 'Rashida Khatun',
    presentAddress: '789 Gulshan, Dhaka',
    permanentAddress: '321 Sylhet, Bangladesh',
    bloodGroup: 'A+',
    religion: 'Islam',
    birthCertificateNo: 'BC987654321',
    nationality: 'Bangladeshi',
    achievements: 'Regional Gold Medalist'
  },
  {
    _id: '3',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    mobile: '01556789012',
    belt: 'Brown',
    skbId: 'SKB0003',
    joinDate: '2021-06-20T00:00:00.000Z',
    isActive: true,
    dateOfBirth: '1995-11-08T00:00:00.000Z',
    gender: 'male',
    profession: 'Student',
    fatherName: 'Mohammad Hassan',
    motherName: 'Salma Begum',
    presentAddress: '456 Uttara, Dhaka',
    permanentAddress: '789 Chittagong, Bangladesh',
    bloodGroup: 'O+',
    religion: 'Islam',
    birthCertificateNo: 'BC456789123',
    nationality: 'Bangladeshi'
  },
  {
    _id: '4',
    name: 'Rashida Akter',
    email: 'rashida@example.com',
    mobile: '01634567890',
    belt: 'Blue',
    skbId: 'SKB0004',
    joinDate: '2022-02-14T00:00:00.000Z',
    isActive: true,
    dateOfBirth: '1998-04-25T00:00:00.000Z',
    gender: 'female',
    profession: 'Designer',
    fatherName: 'Rafiqul Islam',
    motherName: 'Nasreen Akter',
    presentAddress: '321 Banani, Dhaka',
    permanentAddress: '654 Rajshahi, Bangladesh',
    bloodGroup: 'AB+',
    religion: 'Islam',
    birthCertificateNo: 'BC789123456',
    nationality: 'Bangladeshi'
  },
  {
    _id: '5',
    name: 'Mohammad Ali',
    email: 'ali@example.com',
    mobile: '01712987654',
    belt: 'Green',
    skbId: 'SKB0005',
    joinDate: '2023-01-08T00:00:00.000Z',
    isActive: true,
    dateOfBirth: '2000-09-12T00:00:00.000Z',
    gender: 'male',
    profession: 'Student',
    fatherName: 'Abdul Ali',
    motherName: 'Rahima Khatun',
    presentAddress: '987 Mirpur, Dhaka',
    permanentAddress: '123 Barisal, Bangladesh',
    bloodGroup: 'B-',
    religion: 'Islam',
    birthCertificateNo: 'BC321654987',
    nationality: 'Bangladeshi'
  }
];

// Mock Notices Data
const mockNotices: MockNotice[] = [
  {
    _id: '1',
    title: 'National Shotokan Championship 2024',
    content: 'We are excited to announce the upcoming National Shotokan Championship 2024. This prestigious tournament will bring together the finest karate practitioners from across Bangladesh. The championship will feature individual kata and kumite competitions, team events, and special demonstrations by master instructors. Participants will compete in various age groups and skill levels, ensuring fair competition for everyone.',
    category: 'tournament',
    date: '2024-03-15T09:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    location: 'National Sports Complex, Dhaka',
    organizer: 'Bangladesh Karate Federation',
    contactInfo: 'championship@shotokanbd.com | +880-1712-345678',
    rules: 'Tournament will follow WKF rules and regulations. All participants must be registered members of SKB. Protective gear is mandatory for kumite events. Age categories: Under 12, Under 16, Under 21, and Senior divisions.',
    prizeStructure: '1st Place: Gold Medal + 50,000 BDT\n2nd Place: Silver Medal + 30,000 BDT\n3rd Place: Bronze Medal + 20,000 BDT\nParticipation certificates for all contestants',
    registrationDeadline: '2024-02-28T23:59:59.000Z',
    maxParticipants: 200,
    currentParticipants: 87,
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '2',
    title: 'Inter-Dojo Friendship Tournament',
    content: 'Join us for our annual Inter-Dojo Friendship Tournament where we welcome students from partner dojos across the region. This friendly competition emphasizes sportsmanship, technique, and cultural exchange. The event promotes unity within the karate community and provides valuable competitive experience for students of all levels.',
    category: 'tournament',
    date: '2024-04-05T10:00:00.000Z',
    createdAt: '2024-01-08T00:00:00.000Z',
    location: 'SKB Main Dojo, Gulshan',
    organizer: 'Shotokan Karate Bangladesh',
    contactInfo: 'events@shotokanbd.com | +880-1798-765432',
    rules: 'Friendly tournament format with emphasis on technique and sportsmanship. All belt levels welcome. Kata and light-contact kumite divisions available.',
    prizeStructure: 'Trophies for 1st, 2nd, and 3rd place in each category\nParticipation medals for all contestants\nSpecial recognition for best technique and sportsmanship',
    registrationDeadline: '2024-03-25T18:00:00.000Z',
    maxParticipants: 150,
    currentParticipants: 45,
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '3',
    title: 'Guest Instructor Workshop - Advanced Kata Techniques',
    content: 'We are honored to host Sensei Takeshi Yamamoto, 7th Dan, for a special workshop on advanced kata techniques. This exclusive session will focus on the finer points of kata performance, breathing techniques, and the spiritual aspects of karate practice. Sensei Yamamoto brings over 30 years of experience and will share insights from traditional Japanese karate training methods.',
    category: 'event',
    date: '2024-02-20T15:00:00.000Z',
    createdAt: '2024-01-12T00:00:00.000Z',
    location: 'SKB Main Dojo, Gulshan',
    organizer: 'Shotokan Karate Bangladesh',
    contactInfo: 'workshop@shotokanbd.com | +880-1712-345678',
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '4',
    title: 'Belt Grading Examination - March 2024',
    content: 'The quarterly belt grading examination is scheduled for March 10th, 2024. Students who have completed the required training hours and wish to advance to the next belt level should submit their applications by February 25th. The examination will cover kata performance, basic techniques, and sparring skills appropriate to each belt level. Senior instructors will evaluate candidates based on technical proficiency, understanding of karate principles, and demonstration of proper etiquette.',
    category: 'event',
    date: '2024-03-10T14:00:00.000Z',
    createdAt: '2024-01-20T00:00:00.000Z',
    location: 'SKB Main Dojo, Gulshan',
    organizer: 'SKB Grading Committee',
    contactInfo: 'grading@shotokanbd.com | +880-1798-765432',
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '5',
    title: 'New Training Schedule Effective February 2024',
    content: 'Please note that starting February 1st, 2024, we will be implementing a new training schedule to better accommodate our growing membership. Evening classes will now start 30 minutes earlier, and we are adding weekend morning sessions for beginners. All members are requested to check the updated timetable posted on our notice board. The new schedule includes specialized classes for different age groups and skill levels, ensuring optimal learning environments for all students.',
    category: 'notice',
    date: '2024-01-28T00:00:00.000Z',
    createdAt: '2024-01-28T00:00:00.000Z',
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '6',
    title: 'Updated Safety Protocols',
    content: 'In line with our commitment to student safety, we have updated our dojo safety protocols. All students must now wear appropriate protective gear during sparring sessions. New safety equipment is available for purchase at the dojo reception. Please familiarize yourself with the updated guidelines. These protocols ensure the wellbeing of all practitioners while maintaining the authentic spirit of karate training.',
    category: 'notice',
    date: '2024-01-10T00:00:00.000Z',
    createdAt: '2024-01-10T00:00:00.000Z',
    isActive: true,
    createdBy: { username: 'admin' }
  },
  {
    _id: '7',
    title: 'Dojo Maintenance and Cleaning Day',
    content: 'We will be conducting our monthly dojo maintenance and deep cleaning on January 30th, 2024. All classes scheduled for that day will be cancelled. We encourage all members to volunteer and help maintain our training facility. Light refreshments will be provided for all volunteers. This community effort helps us maintain the high standards of cleanliness and safety that our dojo is known for.',
    category: 'notice',
    date: '2024-01-30T00:00:00.000Z',
    createdAt: '2024-01-18T00:00:00.000Z',
    isActive: true,
    createdBy: { username: 'admin' }
  }
];

// Mock Gallery Images Data
const mockGalleryImages: MockGalleryImage[] = [
  {
    _id: '1',
    title: 'National Championship 2023',
    description: 'Highlights from the National Shotokan Championship 2023',
    imageUrl: 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg',
    altText: 'Karate tournament action shot',
    category: 'tournament',
    isActive: true,
    createdAt: '2023-12-15T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  },
  {
    _id: '2',
    title: 'Training Session - Kata Practice',
    description: 'Students practicing kata forms during evening training',
    imageUrl: 'https://images.pexels.com/photos/7045694/pexels-photo-7045694.jpeg',
    altText: 'Students practicing karate kata',
    category: 'training',
    isActive: true,
    createdAt: '2023-11-20T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  },
  {
    _id: '3',
    title: 'Belt Grading Ceremony',
    description: 'Quarterly belt grading ceremony with new black belts',
    imageUrl: 'https://images.pexels.com/photos/7045695/pexels-photo-7045695.jpeg',
    altText: 'Belt grading ceremony',
    category: 'grading',
    isActive: true,
    createdAt: '2023-10-10T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  },
  {
    _id: '4',
    title: 'Youth Training Program',
    description: 'Young students learning basic techniques',
    imageUrl: 'https://images.pexels.com/photos/7045696/pexels-photo-7045696.jpeg',
    altText: 'Youth karate training',
    category: 'training',
    isActive: true,
    createdAt: '2023-09-25T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  },
  {
    _id: '5',
    title: 'Sensei Workshop',
    description: 'Special workshop with visiting Japanese sensei',
    imageUrl: 'https://images.pexels.com/photos/7045697/pexels-photo-7045697.jpeg',
    altText: 'Karate workshop with sensei',
    category: 'event',
    isActive: true,
    createdAt: '2023-08-15T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  },
  {
    _id: '6',
    title: 'Dojo Opening Ceremony',
    description: 'Grand opening of our new training facility',
    imageUrl: 'https://images.pexels.com/photos/7045698/pexels-photo-7045698.jpeg',
    altText: 'Dojo opening ceremony',
    category: 'event',
    isActive: true,
    createdAt: '2023-07-01T00:00:00.000Z',
    uploadedBy: { username: 'admin' }
  }
];

// Utility function to simulate API delay
const simulateApiDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API Functions

export const mockApi = {
  // Members API
  async getMembers(params?: { page?: number; limit?: number; search?: string; belt?: string }) {
    await simulateApiDelay(800);
    
    let filteredMembers = [...mockMembers];
    
    // Apply search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.skbId.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply belt filter
    if (params?.belt) {
      filteredMembers = filteredMembers.filter(member => member.belt === params.belt);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        members: paginatedMembers,
        pagination: {
          current: page,
          pages: Math.ceil(filteredMembers.length / limit),
          total: filteredMembers.length
        }
      }
    };
  },

  async getMember(id: string) {
    await simulateApiDelay(500);
    const member = mockMembers.find(m => m._id === id);
    
    if (!member) {
      return { success: false, message: 'Member not found' };
    }
    
    return { success: true, data: { member } };
  },

  async deleteMember(id: string) {
    await simulateApiDelay(600);
    const index = mockMembers.findIndex(m => m._id === id);
    
    if (index === -1) {
      return { success: false, message: 'Member not found' };
    }
    
    mockMembers.splice(index, 1);
    return { success: true, message: 'Member deleted successfully' };
  },

  // Notices API
  async getNotices(params?: { page?: number; limit?: number; category?: string }) {
    await simulateApiDelay(700);
    
    let filteredNotices = [...mockNotices];
    
    // Apply category filter
    if (params?.category && params.category !== 'all') {
      filteredNotices = filteredNotices.filter(notice => notice.category === params.category);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedNotices = filteredNotices.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        notices: paginatedNotices,
        pagination: {
          current: page,
          pages: Math.ceil(filteredNotices.length / limit),
          total: filteredNotices.length
        }
      }
    };
  },

  async deleteNotice(id: string) {
    await simulateApiDelay(600);
    const index = mockNotices.findIndex(n => n._id === id);
    
    if (index === -1) {
      return { success: false, message: 'Notice not found' };
    }
    
    mockNotices.splice(index, 1);
    return { success: true, message: 'Notice deleted successfully' };
  },

  // Gallery API
  async getGalleryImages(params?: { page?: number; limit?: number; category?: string }) {
    await simulateApiDelay(600);
    
    let filteredImages = [...mockGalleryImages];
    
    // Apply category filter
    if (params?.category && params.category !== 'all') {
      filteredImages = filteredImages.filter(image => image.category === params.category);
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedImages = filteredImages.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        images: paginatedImages,
        pagination: {
          current: page,
          pages: Math.ceil(filteredImages.length / limit),
          total: filteredImages.length
        }
      }
    };
  },

  async deleteGalleryImage(id: string) {
    await simulateApiDelay(600);
    const index = mockGalleryImages.findIndex(img => img._id === id);
    
    if (index === -1) {
      return { success: false, message: 'Image not found' };
    }
    
    mockGalleryImages.splice(index, 1);
    return { success: true, message: 'Image deleted successfully' };
  },

  // Dashboard API
  async getDashboardStats(): Promise<{ success: boolean; data: MockDashboardStats }> {
    await simulateApiDelay(900);
    
    const stats: MockDashboardStats = {
      totalMembers: mockMembers.length,
      totalNotices: mockNotices.length,
      totalEvents: mockNotices.filter(n => n.category === 'event').length,
      totalTournaments: mockNotices.filter(n => n.category === 'tournament').length,
      totalGalleryImages: mockGalleryImages.length,
      recentRegistrations: Math.floor(Math.random() * 10) + 1
    };
    
    return { success: true, data: stats };
  },

  // Authentication API
  async login(credentials: { username: string; password: string }) {
    await simulateApiDelay(1200);
    
    // Mock authentication - accept any credentials for demo
    if (credentials.username && credentials.password) {
      const mockUser = {
        _id: 'mock-admin-id',
        username: credentials.username,
        email: `${credentials.username}@shotokanbd.com`,
        role: 'admin' as const,
        isActive: true,
        lastLogin: new Date().toISOString()
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: mockUser,
          token: mockToken
        }
      };
    }
    
    return {
      success: false,
      message: 'Invalid credentials'
    };
  }
};

// Export individual data arrays for direct access
export { mockMembers, mockNotices, mockGalleryImages };