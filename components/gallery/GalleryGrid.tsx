"use client";

import { useState } from 'react';
import GalleryImage from './GalleryImage';
import ImageViewer from './ImageViewer';

const galleryImages = [
  {
    src: '/gallery/image1.jpg',
    alt: 'Karate Training Session',
  },
  {
    src: '/gallery/image2.jpg',
    alt: 'Championship Event',
  },
  {
    src: '/gallery/image3.jpg',
    alt: 'Belt Grading Ceremony',
  },
];

export default function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <GalleryImage
            key={index}
            src={image.src}
            alt={image.alt}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      <ImageViewer
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
      />
    </>
  );
}