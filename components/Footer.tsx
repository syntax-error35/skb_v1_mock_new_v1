"use client";

import Link from 'next/link';
import { Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Shotokan+Karate+Bangladesh,Dhaka', '_blank');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+8801712345678">+880 171 234 5678</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@shotokanbd.com">info@shotokanbd.com</a>
              </div>
              <button 
                onClick={openGoogleMaps}
                className="flex items-center gap-2 hover:text-white"
              >
                <MapPin className="h-4 w-4" />
                <span>123 Karate Street, Dhaka, Bangladesh</span>
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/shotokankaratebangladesh" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@shotokankaratebangladesh" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/notices" className="block hover:text-white">Notices</Link>
              <Link href="/gallery" className="block hover:text-white">Gallery</Link>
              <Link href="/members" className="block hover:text-white">Members</Link>
              <Link href="/register" className="block hover:text-white">Register</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Shotokan Karate Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}