"use client";

import Image from "next/image";
import Link from "next/link";

export default function ArtisanEdit() {
  return (
    <section className="bg-[#0F172A] text-white py-12 md:py-16 px-6 md:px-12 lg:px-16">
      <div className=" mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
        {/* Left Side: Images */}
        <div className="flex flex-col md:flex-row w-full md:w-3/5 gap-6 md:gap-8">
          {/* Ceramic Bowls */}
          <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl shadow-lg relative">
            <Image
              src="https://images.unsplash.com/photo-1721328004336-c19ee38adcd1?auto=format&fit=crop&w=800&q=80"
              alt="Handmade ceramic bowls in earthy tones"
              fill
              className="object-cover"
            />
          </div>

          {/* Artisan at Work */}
          <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl shadow-lg relative">
            <Image
              src="https://images.unsplash.com/photo-1753164725849-54c0698969e5?auto=format&fit=crop&w=800&q=80"
              alt="Artisan shaping clay on pottery wheel"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side: Text & CTA */}
        <div className="md:w-2/5 text-center md:text-left flex flex-col justify-center">
          <h2
            className="text-3xl font-medium tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: '48px',
             }}
          >
            The Artisan Edit
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
            Unwind in style. Discover our handpicked selection of ceramic
            dinnerware, serveware, and drinkware designed for effortless elegance
            and timeless appeal.
          </p>
          <Link href="/products" className="inline-block">
            <button className="border border-pink-500 text-white bg-transparent px-8 py-3 rounded-md hover:bg-white hover:text-[#1E3A8A] transition-all duration-300 font-medium shadow-sm hover:shadow-pink-200">
              Shop Collection
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}