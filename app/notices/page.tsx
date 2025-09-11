"use client";

import { useState, useEffect } from 'react';
import { Bell, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoticeCard from '@/components/notices/NoticeCard';
import TournamentCard from '@/components/notices/TournamentCard';
import NoticeDetailModal from '@/components/notices/NoticeDetailModal';
import TournamentRegistrationForm from '@/components/notices/TournamentRegistrationForm';
import { Notice } from '@/types/notice';
// MOCK DATA IMPORT - TEMPORARY
import { mockApi, mockNotices } from '@/lib/mockData';

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

export default function NoticesPage() {
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Notice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT FOR BACKEND
      const data = await mockApi.getNotices({ limit: 100 });
      
      if (data.success) {
        const convertedNotices = data.data.notices.map(convertMockNoticeToFrontend);
        setAllNotices(convertedNotices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort notices by creation date (newest first)
  const sortedNotices = allNotices.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Filter notices based on active tab
  const filteredNotices = activeTab === 'all' 
    ? sortedNotices 
    : sortedNotices.filter(notice => notice.category === activeTab);

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);
  };

  const handleTournamentRegister = (tournament: Notice) => {
    setSelectedTournament(tournament);
    setIsRegistrationModalOpen(true);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') return sortedNotices.length;
    return sortedNotices.filter(notice => notice.category === category).length;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Bell className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Notices & Events</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with announcements, events, and tournaments
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            All ({getCategoryCount('all')})
          </TabsTrigger>
          <TabsTrigger value="notice" className="flex items-center gap-2">
            Notices ({getCategoryCount('notice')})
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-2">
            Events ({getCategoryCount('event')})
          </TabsTrigger>
          <TabsTrigger value="tournament" className="flex items-center gap-2">
            Tournaments ({getCategoryCount('tournament')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse p-6 border border-gray-200 rounded-lg bg-white">
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
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No {activeTab === 'all' ? 'notices' : activeTab + 's'} available
              </h3>
              <p className="text-gray-500">Check back later for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices.map((notice) => (
                notice.category === 'tournament' ? (
                  <TournamentCard
                    key={notice.id}
                    notice={notice}
                    onViewDetails={() => handleNoticeClick(notice)}
                    onRegister={() => handleTournamentRegister(notice)}
                  />
                ) : (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onClick={() => handleNoticeClick(notice)}
                  />
                )
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedNotice(null);
        }}
      />

      <TournamentRegistrationForm
        tournament={selectedTournament}
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setSelectedTournament(null);
        }}
      />
    </div>
  );
}