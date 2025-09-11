import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ImageSlider from "@/components/ImageSlider";
import NoticeSection from "@/components/NoticeSection";

export default function Home() {
  return (
    <main>
      {/* Hero Section with Slider */}
      <ImageSlider />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Traditional Training</h3>
              <p className="text-gray-600">Experience authentic Shotokan Karate training following time-honored traditions and techniques.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
              <p className="text-gray-600">Learn from certified instructors with years of experience in Shotokan Karate.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Regular Events</h3>
              <p className="text-gray-600">Participate in tournaments, gradings, and special training sessions throughout the year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <NoticeSection />
    </main>
  );
}