"use client";

import Image from 'next/image';

interface GalleryImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export default function GalleryImage({ src, alt, onClick }: GalleryImageProps) {
  return (
    <div 
      className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform hover:scale-110"
      />
    </div>
  );
}