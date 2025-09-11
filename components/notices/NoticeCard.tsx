"use client";

import { Calendar, Users, Megaphone, Trophy, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Notice } from '@/types/notice';

interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
}

export default function NoticeCard({ notice, onClick }: NoticeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const getCategoryBadge = () => {
    switch (notice.category) {
      case 'event':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Users className="h-3 w-3 mr-1" />
            Event
          </Badge>
        );
      case 'tournament':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            <Trophy className="h-3 w-3 mr-1" />
            Tournament
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            <Megaphone className="h-3 w-3 mr-1" />
            Notice
          </Badge>
        );
    }
  };

  return (
    <article 
      className="group p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${notice.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {getCategoryBadge()}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
          <Calendar className="h-3 w-3" />
          <time dateTime={notice.date}>{formatDate(notice.date)}</time>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
        {notice.title}
      </h3>
      
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">
        {truncateContent(notice.content)}
      </p>

      {/* Additional info for events and tournaments */}
      {(notice.location || notice.organizer) && (
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
          {notice.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{notice.location}</span>
            </div>
          )}
          {notice.organizer && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">{notice.organizer}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {notice.category === 'event' ? 'Upcoming Event' : 
           notice.category === 'tournament' ? 'Tournament' : 'General Announcement'}
        </span>
      </div>
    </article>
  );
}