export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'notice' | 'event' | 'tournament';
  date: string;
  createdAt: Date;
  location?: string;
  organizer?: string;
  contactInfo?: string;
  rules?: string;
  prizeStructure?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface TournamentRegistration {
  name: string;
  skb_id: string;
  tournamentId: string;
}