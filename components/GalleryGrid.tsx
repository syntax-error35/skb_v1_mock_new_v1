"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
// MOCK DATA IMPORT - TEMPORARY
import { mockApi, MockGalleryImage } from '@/lib/mockData';

interface GalleryImageData {
  src: string;
  alt: string;
  title: string;
}

export default function GalleryGrid() {
  const [galleryImages, setGalleryImages] = useState<GalleryImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImageData | null>(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT FOR BACKEND
      const data = await mockApi.getGalleryImages({ limit: 20 });
      
      if (data.success) {
        const convertedImages = data.data.images.map((img: MockGalleryImage) => ({
          src: img.imageUrl,
          alt: img.altText,
          title: img.title
        }));
        setGalleryImages(convertedImages);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="font-semibold text-sm">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{selectedImage?.alt}</DialogTitle>
          {selectedImage && (
            <>
              <div className="relative aspect-video">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/7045693/pexels-photo-7045693.jpeg';
                  }}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}