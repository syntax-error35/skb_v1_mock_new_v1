"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bell, Image, Trophy, TrendingUp, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
// COMMENTED OUT - ORIGINAL BACKEND IMPORT
// import { makeAuthenticatedRequest } from "@/lib/auth";
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from "@/lib/mockData";

interface DashboardStats {
  totalMembers: number;
  totalNotices: number;
  totalEvents: number;
  totalTournaments: number;
  totalGalleryImages: number;
  recentRegistrations: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalNotices: 0,
    totalEvents: 0,
    totalTournaments: 0,
    totalGalleryImages: 0,
    recentRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUESTS
      // TODO: Uncomment when reconnecting to backend
      /*
      // Fetch data from multiple endpoints
      const [membersRes, noticesRes, galleryRes] = await Promise.all([
        makeAuthenticatedRequest('http://localhost:5000/api/members?limit=1'),
        makeAuthenticatedRequest('http://localhost:5000/api/notices?limit=1'),
        makeAuthenticatedRequest('http://localhost:5000/api/gallery?limit=1'),
      ]);

      const [membersData, noticesData, galleryData] = await Promise.all([
        membersRes.json(),
        noticesRes.json(),
        galleryRes.json(),
      ]);

      // Get notices by category
      const [eventsRes, tournamentsRes] = await Promise.all([
        makeAuthenticatedRequest('http://localhost:5000/api/notices?category=event&limit=1'),
        makeAuthenticatedRequest('http://localhost:5000/api/notices?category=tournament&limit=1'),
      ]);

      const [eventsData, tournamentsData] = await Promise.all([
        eventsRes.json(),
        tournamentsRes.json(),
      ]);

      setStats({
        totalMembers: membersData.data?.pagination?.total || 0,
        totalNotices: noticesData.data?.pagination?.total || 0,
        totalEvents: eventsData.data?.pagination?.total || 0,
        totalTournaments: tournamentsData.data?.pagination?.total || 0,
        totalGalleryImages: galleryData.data?.pagination?.total || 0,
        recentRegistrations: Math.floor(Math.random() * 10) + 1, // Mock data
      });
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const result = await mockApi.getDashboardStats();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      description: "Registered karate members",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Notices",
      value: stats.totalNotices,
      description: "Published notices",
      icon: Bell,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      description: "Upcoming events",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Tournaments",
      value: stats.totalTournaments,
      description: "Active tournaments",
      icon: Trophy,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Gallery Images",
      value: stats.totalGalleryImages,
      description: "Photos in gallery",
      icon: Image,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Recent Registrations",
      value: stats.recentRegistrations,
      description: "This week",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Welcome to the Shotokan Karate Bangladesh admin panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}