"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
// COMMENTED OUT - ORIGINAL BACKEND IMPORT
// import { makeAuthenticatedRequest } from "@/lib/auth";
// MOCK DATA IMPORT - TEMPORARY
import { mockApi } from "@/lib/mockData";
import { toast } from "sonner";
import Image from 'next/image';

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

  const categories = ['training', 'tournament', 'grading', 'event', 'general'];

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
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
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