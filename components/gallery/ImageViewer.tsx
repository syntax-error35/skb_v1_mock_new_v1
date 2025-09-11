"use client";

import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    alt: string;
  } | null;
}

export default function ImageViewer({ isOpen, onClose, image }: ImageViewerProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">{image.alt}</DialogTitle>
        <div className="relative aspect-video">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}