"use client";

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Eye, Bell, Users, Trophy } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
// COMMENTED OUT - ORIGINAL BACKEND IMPORT
// import { makeAuthenticatedRequest } from "@/lib/auth";
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Form validation schema
const addNoticeFormSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must not exceed 5000 characters"),
  category: z.enum(['notice', 'event', 'tournament'], {
    required_error: "Please select a notice type",
  }),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  date: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  location: z.string().max(200, "Location must not exceed 200 characters").optional(),
  organizer: z.string().max(100, "Organizer must not exceed 100 characters").optional(),
  contactInfo: z.string().max(300, "Contact info must not exceed 300 characters").optional(),
  targetAudience: z.array(z.string()).optional(),
  // Tournament specific fields
  rules: z.string().max(2000, "Rules must not exceed 2000 characters").optional(),
  prizeStructure: z.string().max(1000, "Prize structure must not exceed 1000 characters").optional(),
  registrationDeadline: z.date().optional(),
  maxParticipants: z.number().min(1, "Must allow at least 1 participant").optional(),
}).refine((data) => {
  // Tournament validation
  if (data.category === 'tournament') {
    return data.registrationDeadline && data.maxParticipants;
  }
  return true;
}, {
  message: "Registration deadline and max participants are required for tournaments",
  path: ["registrationDeadline"],
}).refine((data) => {
  // End date validation
  if (data.endDate && data.date) {
    return data.endDate >= data.date;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: 'notice' | 'event' | 'tournament';
  date: string;
  location?: string;
  organizer?: string;
  isActive: boolean;
  createdAt: string;
  currentParticipants?: number;
  maxParticipants?: number;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Form setup
  const form = useForm<z.infer<typeof addNoticeFormSchema>>({
    resolver: zodResolver(addNoticeFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: undefined,
      priority: "medium",
      targetAudience: [],
    },
  });

  // Watch category to show/hide conditional fields
  const watchedCategory = form.watch("category");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const categoryParam = activeTab === 'all' ? '' : `&category=${activeTab}`;
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/notices?limit=100${categoryParam}`
      );
      const data = await response.json();
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getNotices({ limit: 100, category: activeTab === 'all' ? undefined : activeTab });
      
      if (data.success) {
        setNotices(data.data.notices);
      } else {
        toast.error("Failed to fetch notices");
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error("Error fetching notices");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/notices/${noticeId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      */
      
      // MOCK DELETE - TEMPORARY REPLACEMENT
      const data = await mockApi.deleteNotice(noticeId);
      
      if (data.success) {
        toast.success("Notice deleted successfully");
        fetchNotices();
      } else {
        toast.error("Failed to delete notice");
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error("Error deleting notice");
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || notice.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'event':
        return <Badge className="bg-blue-100 text-blue-800"><Users className="h-3 w-3 mr-1" />Event</Badge>;
      case 'tournament':
        return <Badge className="bg-purple-100 text-purple-800"><Trophy className="h-3 w-3 mr-1" />Tournament</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800"><Bell className="h-3 w-3 mr-1" />Notice</Badge>;
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') return notices.length;
    return notices.filter(notice => notice.category === category).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Notices & Events</h2>
            <p className="text-gray-600 mt-2">
              Manage notices, events, and tournaments
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Notice
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({getCategoryCount('all')})</TabsTrigger>
            <TabsTrigger value="notice">Notices ({getCategoryCount('notice')})</TabsTrigger>
            <TabsTrigger value="event">Events ({getCategoryCount('event')})</TabsTrigger>
            <TabsTrigger value="tournament">Tournaments ({getCategoryCount('tournament')})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'all' ? 'All Notices' : 
                   activeTab === 'notice' ? 'General Notices' :
                   activeTab === 'event' ? 'Events' : 'Tournaments'} 
                  ({filteredNotices.length})
                </CardTitle>
                <CardDescription>
                  Manage your {activeTab === 'all' ? 'notices, events, and tournaments' : activeTab + 's'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          {activeTab === 'tournament' && <TableHead>Participants</TableHead>}
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotices.map((notice) => (
                          <TableRow key={notice._id}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="truncate">{notice.title}</div>
                            </TableCell>
                            <TableCell>{getCategoryBadge(notice.category)}</TableCell>
                            <TableCell>
                              {new Date(notice.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">{notice.location || '-'}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={notice.isActive ? "default" : "secondary"}>
                                {notice.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            {activeTab === 'tournament' && (
                              <TableCell>
                                {notice.currentParticipants || 0} / {notice.maxParticipants || 0}
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteNotice(notice._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}