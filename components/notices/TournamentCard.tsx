"use client";

import { useState, useEffect } from 'react';
import { Calendar, Trophy, MapPin, User, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notice } from '@/types/notice';

interface TournamentCardProps {
  notice: Notice;
  onViewDetails: () => void;
  onRegister: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TournamentCard({ notice, onViewDetails, onRegister }: TournamentCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!notice.registrationDeadline) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(notice.registrationDeadline!).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [notice.registrationDeadline]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <article className="group p-6 border border-purple-200 rounded-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 bg-gradient-to-br from-white to-purple-50 transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3 mb-4">
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
          <Trophy className="h-3 w-3 mr-1" />
          Tournament
        </Badge>
        <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
          <Calendar className="h-3 w-3" />
          <time dateTime={notice.date}>{formatDate(notice.date)}</time>
        </div>
      </div>
      
      <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
        {notice.title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {truncateContent(notice.content)}
      </p>

      {/* Tournament Info */}
      <div className="space-y-2 mb-4">
        {notice.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{notice.location}</span>
          </div>
        )}
        {notice.organizer && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{notice.organizer}</span>
          </div>
        )}
        {notice.maxParticipants && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {notice.currentParticipants || 0} / {notice.maxParticipants} participants
            </span>
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      {notice.registrationDeadline && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              {isExpired ? 'Registration Closed' : 'Registration Deadline'}
            </span>
          </div>
          
          {!isExpired ? (
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-purple-100 rounded">
                <div className="text-lg font-bold text-purple-800">{timeLeft.days}</div>
                <div className="text-xs text-purple-600">Days</div>
              </div>
              <div className="text-center p-2 bg-purple-100 rounded">
                <div className="text-lg font-bold text-purple-800">{timeLeft.hours}</div>
                <div className="text-xs text-purple-600">Hours</div>
              </div>
              <div className="text-center p-2 bg-purple-100 rounded">
                <div className="text-lg font-bold text-purple-800">{timeLeft.minutes}</div>
                <div className="text-xs text-purple-600">Min</div>
              </div>
              <div className="text-center p-2 bg-purple-100 rounded">
                <div className="text-lg font-bold text-purple-800">{timeLeft.seconds}</div>
                <div className="text-xs text-purple-600">Sec</div>
              </div>
            </div>
          ) : (
            <div className="text-center p-3 bg-red-100 rounded border border-red-200">
              <span className="text-red-800 font-medium">Registration Period Ended</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          onClick={onRegister}
          disabled={isExpired || (notice.maxParticipants ? ((notice.currentParticipants || 0) >= notice.maxParticipants) : false)}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isExpired ? 'Registration Closed' : 'Register Now'}
        </Button>
      </div>
    </article>
  );
}