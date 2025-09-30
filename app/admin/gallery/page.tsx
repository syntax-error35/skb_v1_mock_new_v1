"use client";

import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, CreditCard as Edit, Trash2, Upload, Image as ImageIcon, X, Loader as Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
// COMMENTED OUT - ORIGINAL BACKEND IMPORT
// import { makeAuthenticatedRequest } from "@/lib/auth";
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from "@/lib/mockData";
import { toast } from "sonner";
import Image from 'next/image';

// Form validation schema
const uploadImageFormSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: z.string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  altText: z.string()
    .min(1, "Alt text is required")
    .max(200, "Alt text must not exceed 200 characters"),
  category: z.string()
    .min(1, "Category is required"),
  imageFile: z.any()
    .refine((file) => file instanceof File, "Please select an image file")
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => file && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
});

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  uploadedBy: {
    username: string;
  };
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const categories = ['training', 'tournament', 'grading', 'event', 'general'];

  // Form setup
  const form = useForm<z.infer<typeof uploadImageFormSchema>>({
    resolver: zodResolver(uploadImageFormSchema),
    defaultValues: {
      title: "",
      description: "",
      altText: "",
      category: "",
    },
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/gallery?limit=100');
      const data = await response.json();
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getGalleryImages({ 
        limit: 100, 
        category: selectedCategory === 'all' ? undefined : selectedCategory 
      });
      
      if (data.success) {
        setImages(data.data.images);
      } else {
        toast.error("Failed to fetch gallery images");
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error("Error fetching gallery images");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/gallery/${imageId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      */
      
      // MOCK DELETE - TEMPORARY REPLACEMENT
      const data = await mockApi.deleteGalleryImage(imageId);
      
      if (data.success) {
        toast.success("Image deleted successfully");
        fetchImages();
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Error deleting image");
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
      form.setValue('imageFile', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    form.setValue('imageFile', null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (values: z.infer<typeof uploadImageFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // COMMENTED OUT - ORIGINAL BACKEND SUBMISSION
      // TODO: Uncomment when reconnecting to backend
      /*
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('altText', values.altText);
      formData.append('category', values.category);
      if (values.description) {
        formData.append('description', values.description);
      }
      formData.append('image', values.imageFile);
      
      const response = await makeAuthenticatedRequest('http://localhost:5000/api/gallery', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
        headers: {
          'Authorization': `Bearer ${getAdminToken()}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Image uploaded successfully!");
        form.reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploadModalOpen(false);
        fetchImages(); // Refresh the images list
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
      */
      
      // MOCK SUBMISSION - TEMPORARY REPLACEMENT
      const data = await mockApi.addGalleryImage({
        title: values.title,
        description: values.description,
        altText: values.altText,
        category: values.category,
        imageFile: values.imageFile
      });
      
      if (data.success) {
        toast.success("Image uploaded successfully!", {
          description: `"${values.title}" has been added to the gallery.`,
          duration: 5000,
        });
        
        form.reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploadModalOpen(false);
        fetchImages(); // Refresh the images list
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image", {
        description: "Please try again or contact support if the problem persists.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'tournament': return 'bg-purple-100 text-purple-800';
      case 'grading': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
            <p className="text-gray-600 mt-2">
              Manage gallery images and media
            </p>
          </div>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
                <DialogDescription>
                  Add a new image to the gallery with details and categorization.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <FormLabel className="text-base font-semibold">Image File *</FormLabel>
                    
                    {previewUrl ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
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
                            onClick={handleRemoveFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>File:</strong> {selectedFile?.name}</p>
                          <p><strong>Size:</strong> {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Choose image file
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                JPEG, PNG, WebP up to 5MB
                              </span>
                            </label>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              className="sr-only"
                              onChange={handleFileChange}
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter image title"
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="altText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt Text *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Describe the image for accessibility"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Brief description of the image for screen readers and SEO
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter detailed description..."
                            className="min-h-[100px] resize-none"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setIsUploadModalOpen(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !selectedFile}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Images ({filteredImages.length})</CardTitle>
            <CardDescription>
              Gallery images and media files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No images found</h3>
                <p className="text-gray-500">Upload some images to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <Image
                        src={image.imageUrl}
                        alt={image.altText}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={getCategoryColor(image.category)}>
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
                      {image.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{image.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>By {image.uploadedBy.username}</span>
                        <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(image._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}