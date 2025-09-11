"use client";

import { Calendar, MapPin, User, Phone, Mail, Trophy, Users, Clock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Notice } from '@/types/notice';

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NoticeDetailModal({ notice, isOpen, onClose }: NoticeDetailModalProps) {
  if (!notice) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadge = () => {
    switch (notice.category) {
      case 'event':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Users className="h-4 w-4 mr-2" />
            Event
          </Badge>
        );
      case 'tournament':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Trophy className="h-4 w-4 mr-2" />
            Tournament
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="h-4 w-4 mr-2" />
            Notice
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-3">
                {getCategoryBadge()}
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {notice.title}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <div>
              <time dateTime={notice.date} className="font-medium">
                {formatDate(notice.date)}
              </time>
              <span className="ml-2 text-sm">
                at {formatTime(notice.date)}
              </span>
            </div>
          </div>

          {/* Location */}
          {notice.location && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm">{notice.location}</p>
              </div>
            </div>
          )}

          {/* Organizer */}
          {notice.organizer && (
            <div className="flex items-start gap-2 text-gray-600">
              <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Organized by</p>
                <p className="text-sm">{notice.organizer}</p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {notice.contactInfo && (
            <div className="flex items-start gap-2 text-gray-600">
              <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Contact Information</p>
                <p className="text-sm">{notice.contactInfo}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>
          </div>

          {/* Tournament-specific fields */}
          {notice.category === 'tournament' && (
            <>
              {notice.rules && (
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Rules & Format</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {notice.rules}
                    </p>
                  </div>
                </div>
              )}

              {notice.prizeStructure && (
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Prize Structure
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {notice.prizeStructure}
                    </p>
                  </div>
                </div>
              )}

              {notice.registrationDeadline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-semibold">Registration Deadline</h3>
                  </div>
                  <p className="text-yellow-700">
                    {formatDate(notice.registrationDeadline)} at {formatTime(notice.registrationDeadline)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}