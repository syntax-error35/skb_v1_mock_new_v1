"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const slides = [
  {
    url: '/slide1.jpg',
    title: 'Championship Training',
  },
  {
    url: '/slide2.jpg',
    title: 'Belt Grading Ceremony',
  },
  {
    url: '/slide3.jpg',
    title: 'National Tournament',
  },
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative h-[600px] w-full">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
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
        <h1 className="text-5xl font-bold mb-6">Shotokan Karate Bangladesh</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Empowering minds and bodies through the ancient art of Shotokan Karate. Join our community of dedicated practitioners.
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
          />
        ))}
      </div>
    </div>
  );
}