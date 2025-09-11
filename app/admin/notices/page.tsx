"use client";

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, X, Loader2, FileText, Image as ImageIcon } from "lucide-react";
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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types and sizes
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only images, PDFs, Word documents, and text files are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    if (selectedFiles.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed.`);
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Remove selected file
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleAddNotice = async (values: z.infer<typeof addNoticeFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // COMMENTED OUT - ORIGINAL BACKEND SUBMISSION
      // TODO: Uncomment when reconnecting to backend
      /*
      const formData = new FormData();
      
      // Append form fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'targetAudience' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Append files
      selectedFiles.forEach((file) => {
        formData.append('attachments', file);
      });
      
      const response = await makeAuthenticatedRequest(
        'http://localhost:5000/api/notices',
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary for FormData
          headers: {
            'Authorization': `Bearer ${getAdminToken()}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Notice created successfully!", {
          description: `${values.category.charAt(0).toUpperCase() + values.category.slice(1)} "${values.title}" has been published.`,
          duration: 5000,
        });
        
        form.reset();
        setSelectedFiles([]);
        setIsAddModalOpen(false);
        fetchNotices(); // Refresh the notices list
      } else {
        throw new Error(data.message || 'Failed to create notice');
      }
      */
      
      // MOCK SUBMISSION - TEMPORARY REPLACEMENT
      const mockNoticeData = {
        ...values,
        attachments: selectedFiles.map(file => ({
          filename: file.name,
          originalName: file.name,
          mimetype: file.type,
          size: file.size,
        })),
      };
      
      const data = await mockApi.addNotice(mockNoticeData);
      
      if (data.success) {
        toast.success("Notice created successfully!", {
          description: `${values.category.charAt(0).toUpperCase() + values.category.slice(1)} "${values.title}" has been published.`,
          duration: 5000,
        });
        
        form.reset();
        setSelectedFiles([]);
        setIsAddModalOpen(false);
        fetchNotices(); // Refresh the notices list
      } else {
        throw new Error(data.message || 'Failed to create notice');
      }
      
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error("Failed to create notice", {
        description: "Please try again or contact support if the problem persists.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
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
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
                <DialogDescription>
                  Add a new notice, event, or tournament announcement
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddNotice)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter notice title"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select notice type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="notice">Notice</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="tournament">Tournament</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Priority */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={isSubmitting}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date - Show for events and tournaments */}
                    {(watchedCategory === 'event' || watchedCategory === 'tournament') && (
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={isSubmitting}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick end date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter location"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Organizer */}
                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter organizer name"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content/Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter detailed description..."
                            className="min-h-[120px]"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Info */}
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter contact details (email, phone, etc.)"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Target Audience */}
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Target Audience</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['students', 'faculty', 'staff', 'all'].map((audience) => (
                            <FormField
                              key={audience}
                              control={form.control}
                              name="targetAudience"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={audience}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(audience)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), audience])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== audience
                                                )
                                              )
                                        }}
                                        disabled={isSubmitting}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal capitalize">
                                      {audience}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tournament-specific fields */}
                  {watchedCategory === 'tournament' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Registration Deadline */}
                        <FormField
                          control={form.control}
                          name="registrationDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration Deadline *</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                      disabled={isSubmitting}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick deadline</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Max Participants */}
                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Participants *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="Enter max participants"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Rules */}
                      <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tournament Rules</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter tournament rules and format..."
                                className="min-h-[100px]"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Prize Structure */}
                      <FormField
                        control={form.control}
                        name="prizeStructure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prize Structure</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter prize details..."
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <FormLabel>Attachments</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload files
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              Images, PDFs, Word documents, or text files (max 10MB each, 5 files total)
                            </span>
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            className="sr-only"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Selected Files:</h4>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                {file.type.startsWith('image/') ? (
                                  <ImageIcon className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setSelectedFiles([]);
                        setIsAddModalOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Notice
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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