"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockApi, MockAboutPageContent } from '@/lib/mockData';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<MockAboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('/api/about');
      const data = await response.json();
      
      if (data.success) {
        setAboutContent(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch about content');
      }
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getAboutPageContent();
      
      if (data.success) {
        setAboutContent(data.data);
      } else {
        throw new Error('Failed to fetch about content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!aboutContent) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No content available for the about page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Banner Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {aboutContent.bannerImageUrl ? (
          <>
            <Image
              src={aboutContent.bannerImageUrl}
              alt="About Shotokan Karate Bangladesh"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700" />
        )}
        
        <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {aboutContent.title}
            </h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {aboutContent.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-8">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
          
          {/* Last Updated Info */}
          {aboutContent.lastUpdatedBy && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Last updated on {new Date(aboutContent.lastUpdatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} by {aboutContent.lastUpdatedBy.username}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Begin Your Karate Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of dedicated practitioners and discover the transformative power of Shotokan Karate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Register Now
            </a>
            <a
              href="/notices"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View Events
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}