"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Globe
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-12 pb-6">
      <div className="w-full px-4 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h1
              className="mb-4 text-[#172554]"
              style={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 400,
                fontSize: "29px",
              }}
            >
              Handcrafted by
              <br />
              <div className="flex items-center gap-2 mt-2">
                <img src="/logo.png" alt="TanaRiri Logo" className="w-auto h-12" />
              </div>

            </h1>
           <div className="flex gap-3">
              <Link href="#" className="text-gray-600 hover:text-[#1E3A8A] transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#1E3A8A] transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#1E3A8A] transition-colors duration-200">
                <Youtube className="w-6 h-6" />
              </Link>
            </div>

            {/* Eco icon centered below */}
            <div className="flex justify-start mt-4">
              <img src="/eco-icon1.png" alt="Eco Friendly" className="w-8 h-8" />
            </div>

          </div>

          {/* Collections */}
          <div>
            <h4 className="mb-4 text-md">Collections</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-600 hover:text-black transition-colors duration-200">Products</Link></li>
              <li><Link href="#category" className="text-gray-600 hover:text-black transition-colors duration-200">Shop By Category</Link></li>
              <li><Link href="#occasion" className="text-gray-600 hover:text-black transition-colors duration-200">Shop By Occasions</Link></li>
              {/* <li><Link href="/products" className="text-gray-600 hover:text-black transition-colors duration-200">New Arrivals</Link></li> */}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="mb-4 text-md">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/customer-care" className="text-gray-600 hover:text-black transition-colors duration-200">Customer Care</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-black transition-colors duration-200">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-black transition-colors duration-200">Refunds & Returns</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-black transition-colors duration-200">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-black transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="mb-4 text-md">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-black transition-colors duration-200">About Us</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-black transition-colors duration-200">Home</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black transition-colors duration-200">Contact</Link></li>
              {/* <li><Link href="#faq" className="text-gray-600 hover:text-black transition-colors duration-200">FAQs</Link></li> */}
            </ul>
          </div>

          {/* 4. Corporate Office & Contact */}
          <div className="space-y-4">
            {/* Heading */}
            <div className="text-left space-y-2">
              <h4 className="flex items-center justify-start gap-2 text-base font-medium text-gray-900">
                <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                Corporate Office
              </h4>

              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                <p>207, Shyam Kunj, Shree Shyam Heights,</p>
                <p>Sampat Hills, Bicholi Mardana,</p>
                <p>Indore – 452016, India</p>
              </address>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              {/* Phone Numbers */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href="tel:+919755040030"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#172554] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  +91 97550 40030
                </a>

                <a
                  href="tel:+919644403330"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#172554] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  +91 96444 03330
                </a>
              </div>

              {/* Email */}
              <a
                href="mailto:tanaririllp@gmail.com"
                className="flex items-center gap-2 text-gray-600 hover:text-[#172554] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
                tanaririllp@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-pink-500 pt-6 flex justify-between items-center text-xs text-gray-600">
          <p>&copy; <span className="text-[#1E3A8A]" >TANARIRI</span> 2025, ALL RIGHTS RESERVED</p>
          <p>DESIGNED BY <span className="text-[#1E3A8A]">WEBSEEDER TECHNOLOGY</span></p>
        </div>
      </div>
    </footer>
  );
}
