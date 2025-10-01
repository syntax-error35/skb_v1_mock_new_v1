"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader as Loader2, Save, CircleAlert as AlertCircle, Chrome as HomeIcon, Plus, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockApi, MockHomeSliderContent } from "@/lib/mockData";
import { toast } from "sonner";

// Form validation schema
const homeSliderFormSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),
  subtitle: z.string()
    .min(10, "Subtitle must be at least 10 characters")
    .max(500, "Subtitle must not exceed 500 characters"),
  slides: z.array(z.object({
    imageUrl: z.string()
      .url("Please enter a valid image URL")
      .min(1, "Image URL is required"),
    altText: z.string()
      .min(1, "Alt text is required")
      .max(200, "Alt text must not exceed 200 characters")
  })).min(1, "At least one slide is required").max(10, "Maximum 10 slides allowed")
});

export default function AdminHomePage() {
  const [sliderContent, setSliderContent] = useState<MockHomeSliderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof homeSliderFormSchema>>({
    resolver: zodResolver(homeSliderFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slides: []
    },
  });

  // Field array for dynamic slides
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slides"
  });

  useEffect(() => {
    fetchSliderContent();
  }, []);

  const fetchSliderContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('/api/home-slider');
      const data = await response.json();
      
      if (data.success) {
        setSliderContent(data.data);
        form.reset({
          title: data.data.title,
          subtitle: data.data.subtitle,
          slides: data.data.slides.sort((a, b) => a.order - b.order)
        });
      } else {
        throw new Error(data.message || 'Failed to fetch slider content');
      }
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getHomeSliderContent();
      
      if (data.success) {
        setSliderContent(data.data);
        form.reset({
          title: data.data.title,
          subtitle: data.data.subtitle,
          slides: data.data.slides.sort((a, b) => a.order - b.order)
        });
      } else {
        throw new Error('Failed to fetch slider content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to load slider content', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof homeSliderFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await makeAuthenticatedRequest('/api/home-slider', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Home slider updated successfully!");
        await fetchSliderContent(); // Refresh content
      } else {
        throw new Error(data.message || 'Failed to update slider');
      }
      */
      
      // MOCK UPDATE - TEMPORARY REPLACEMENT
      const data = await mockApi.updateHomeSliderContent(values);
      
      if (data.success) {
        toast.success("Home slider updated successfully!");
        await fetchSliderContent(); // Refresh content
      } else {
        throw new Error('Failed to update slider');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error("Failed to update slider", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSlide = () => {
    append({
      imageUrl: "",
      altText: ""
    });
  };

  const removeSlide = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one slide is required");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading slider content...</p>
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
                onClick={fetchSliderContent}
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Home Page Management</h2>
            <p className="text-gray-600 mt-2">
              Manage the home page slider content and appearance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <Card>
            <CardHeader>
              <CardTitle>Slider Preview</CardTitle>
              <CardDescription>
                Preview how the slider will appear on the home page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Slider Preview */}
                <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700">
                  {form.watch('slides')[0]?.imageUrl && (
                    <Image
                      src={form.watch('slides')[0].imageUrl}
                      alt={form.watch('slides')[0].altText || 'Slider preview'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-4">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        {form.watch('title') || sliderContent?.title}
                      </h1>
                      <p className="text-xl mb-8 drop-shadow-lg">
                        {form.watch('subtitle') || sliderContent?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Slide Indicators */}
                <div className="p-4 bg-gray-100">
                  <div className="flex justify-center gap-2">
                    {form.watch('slides').map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {form.watch('slides').length} slide{form.watch('slides').length !== 1 ? 's' : ''} configured
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Edit Mode */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HomeIcon className="h-5 w-5" />
                      Slider Content
                    </CardTitle>
                    <CardDescription>
                      Edit the main title and subtitle for the home page slider
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slider Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter slider title"
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
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slider Subtitle</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter slider subtitle..."
                              className="min-h-[100px] resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Slides Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Slider Images
                    </CardTitle>
                    <CardDescription>
                      Add, remove, and manage slider images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Slide {index + 1}</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSlide(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`slides.${index}.imageUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg"
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
                          name={`slides.${index}.altText`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alt Text</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Describe the image"
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Image Preview */}
                        {form.watch(`slides.${index}.imageUrl`) && (
                          <div className="relative aspect-video rounded-lg overflow-hidden border">
                            <Image
                              src={form.watch(`slides.${index}.imageUrl`)}
                              alt={form.watch(`slides.${index}.altText`) || 'Preview'}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSlide}
                      disabled={fields.length >= 10}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slide {fields.length >= 10 && '(Maximum reached)'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full lg:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Slider Content
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
}