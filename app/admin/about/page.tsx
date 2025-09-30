"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, X, Save, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockApi, MockAboutPageContent } from "@/lib/mockData";
import { toast } from "sonner";

// Form validation schema
const aboutPageFormSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),
});

export default function AdminAboutPage() {
  const [aboutContent, setAboutContent] = useState<MockAboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form setup
  const form = useForm<z.infer<typeof aboutPageFormSchema>>({
    resolver: zodResolver(aboutPageFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('/api/about');
      const data = await response.json();
      
      if (data.success) {
        setAboutContent(data.data);
        form.reset({
          title: data.data.title,
          description: data.data.description,
        });
      } else {
        throw new Error(data.message || 'Failed to fetch about content');
      }
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getAboutPageContent();
      
      if (data.success) {
        setAboutContent(data.data);
        form.reset({
          title: data.data.title,
          description: data.data.description,
        });
      } else {
        throw new Error('Failed to fetch about content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to load about content', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload a JPEG, PNG, or WebP image."
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB."
        });
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    // Reset file input
    const fileInput = document.getElementById('banner-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploadingImage(true);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const formData = new FormData();
      formData.append('bannerImage', selectedFile);
      
      const response = await makeAuthenticatedRequest('/api/about/upload-banner', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
        headers: {
          'Authorization': `Bearer ${getAdminToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Banner image uploaded successfully!");
        await fetchAboutContent(); // Refresh content
        handleRemoveImage(); // Clear selection
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
      */
      
      // MOCK IMAGE UPLOAD - TEMPORARY REPLACEMENT
      const data = await mockApi.uploadAboutBanner(selectedFile);
      
      if (data.success) {
        toast.success("Banner image uploaded successfully!");
        await fetchAboutContent(); // Refresh content
        handleRemoveImage(); // Clear selection
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error("Failed to upload image", {
        description: errorMessage
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof aboutPageFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("About page updated successfully!");
        await fetchAboutContent(); // Refresh content
      } else {
        throw new Error(data.message || 'Failed to update about page');
      }
      */
      
      // MOCK UPDATE - TEMPORARY REPLACEMENT
      const data = await mockApi.updateAboutPageContent(values);
      
      if (data.success) {
        toast.success("About page updated successfully!");
        await fetchAboutContent(); // Refresh content
      } else {
        throw new Error('Failed to update about page');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error("Failed to update about page", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading about page content...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAboutContent}
                className="ml-4"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">About Page Management</h2>
          <p className="text-gray-600 mt-2">
            Manage the content and banner image for the About page
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Image Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Banner Image
              </CardTitle>
              <CardDescription>
                Upload and manage the banner image for the About page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Banner Image */}
              {aboutContent?.bannerImageUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Banner</h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={aboutContent.bannerImageUrl}
                      alt="Current banner"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Upload New Banner</h4>
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        className="flex-1"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Banner
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="banner-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Choose banner image
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            JPEG, PNG, WebP up to 5MB
                          </span>
                        </label>
                        <input
                          id="banner-upload"
                          name="banner-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Page Content
              </CardTitle>
              <CardDescription>
                Edit the title and description for the About page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter page title"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter page description..."
                            className="min-h-[300px] resize-none"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Use double line breaks to separate paragraphs
                        </p>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update About Page
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        {aboutContent && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview how the About page will appear to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Banner Preview */}
                <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-700">
                  {aboutContent.bannerImageUrl && (
                    <Image
                      src={aboutContent.bannerImageUrl}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h1 className="text-3xl font-bold text-white text-center">
                      {form.watch('title') || aboutContent.title}
                    </h1>
                  </div>
                </div>
                
                {/* Content Preview */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {(form.watch('description') || aboutContent.description)
                        .split('\n\n')
                        .map((paragraph, index) => (
                          <p key={index} className="text-sm">
                            {paragraph.trim()}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}