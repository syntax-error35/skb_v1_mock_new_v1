"use client"
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NoticeCard from './notices/NoticeCard';
import NoticeDetailModal from './notices/NoticeDetailModal';
import { Notice } from '@/types/notice';
import { useState, useEffect } from 'react';
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from '@/lib/mockData';


// Convert mock notices to frontend Notice format
const convertMockNoticeToFrontend = (mockNotice: any): Notice => ({
  id: mockNotice._id,
  title: mockNotice.title,
  content: mockNotice.content,
  category: mockNotice.category,
  date: mockNotice.date,
  createdAt: new Date(mockNotice.createdAt),
  location: mockNotice.location,
  organizer: mockNotice.organizer,
  contactInfo: mockNotice.contactInfo,
  rules: mockNotice.rules,
  prizeStructure: mockNotice.prizeStructure,
  registrationDeadline: mockNotice.registrationDeadline,
  maxParticipants: mockNotice.maxParticipants,
  currentParticipants: mockNotice.currentParticipants
});

export default function NoticeSection() {
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRecentNotices();
  }, []);

  const fetchRecentNotices = async () => {
    try {
      setLoading(true);
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT FOR BACKEND
      const data = await mockApi.getNotices({ limit: 5 });
      
      if (data.success) {
        const convertedNotices = data.data.notices.map(convertMockNoticeToFrontend);
        // Sort by creation date (newest first)
        const sortedNotices = convertedNotices.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setRecentNotices(sortedNotices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-16 bg-gray-50" aria-labelledby="notices-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 id="notices-heading" className="text-3xl font-bold text-gray-900">
                Latest Notices
              </h2>
              <p className="text-gray-600 mt-1">
                Stay updated with our latest announcements and upcoming events
              </p>
            </div>
          </div>
          
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/notices" className="flex items-center gap-2">
              See All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Loading State Placeholder */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentNotices.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices available</h3>
            <p className="text-gray-500">Check back later for updates.</p>
          </div>
        ) : (
          /* Notices Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentNotices.map((notice) => (
              <NoticeCard 
                key={notice.id} 
                notice={notice} 
                onClick={() => handleNoticeClick(notice)}
              />
            ))}
          </div>
        )}

        {/* Mobile See All Button */}
        <div className="flex justify-center sm:hidden">
          <Button asChild className="w-full max-w-xs">
            <Link href="/notices" className="flex items-center justify-center gap-2">
              See All Notices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      </section>

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotice(null);
        }}
      />
    </>
  );
}