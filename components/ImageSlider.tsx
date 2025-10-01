"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { mockApi, MockHomeSliderContent } from '@/lib/mockData';


export default function ImageSlider() {
  const [sliderContent, setSliderContent] = useState<MockHomeSliderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSliderContent();
  }, []);

  const fetchSliderContent = async () => {
    try {
      setLoading(true);
      // COMMENTED OUT - ORIGINAL BACKEND REQUEST
      // TODO: Uncomment when reconnecting to backend
      /*
      const response = await fetch('/api/home-slider');
      const data = await response.json();
      
      if (data.success) {
        setSliderContent(data.data);
      }
      */
      
      // MOCK DATA FETCH - TEMPORARY REPLACEMENT
      const data = await mockApi.getHomeSliderContent();
      
      if (data.success) {
        setSliderContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching slider content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get slides from fetched content or fallback to empty array
  const slides = sliderContent?.slides.sort((a, b) => a.order - b.order) || [];

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Show loading state
  if (loading || !sliderContent || slides.length === 0) {
    return (
      <div className="relative h-[600px] w-full bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl font-bold mb-6">Shotokan Karate Bangladesh</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Empowering minds and bodies through the ancient art of Shotokan Karate. Join our community of dedicated practitioners.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].imageUrl})` }}
        className="absolute inset-0 bg-center bg-cover duration-500"
      />
      
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 z-20 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 z-20 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-center text-white text-center">
        <h1 className="text-5xl font-bold mb-6">{sliderContent.title}</h1>
        <p className="text-xl mb-8 max-w-2xl">
          {sliderContent.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}