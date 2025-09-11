export interface Tournament {
  _id: string;
  title: string;
  content: string;
  category: 'tournament';
  date: string;
  endDate?: string;
  location?: string;
  organizer?: string;
  contactInfo?: string;
  priority?: 'low' | 'medium' | 'high';
  targetAudience?: string[];
  rules?: string;
  prizeStructure?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants: number;
  attachments?: Array<{
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
  }>;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Participant {
  _id: string;
  tournamentId: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'cancelled';
  additionalInfo?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}