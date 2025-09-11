import GalleryGrid from '@/components/GalleryGrid';

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
      <GalleryGrid />
    </div>
  );
}