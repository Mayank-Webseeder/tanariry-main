'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function OccasionCards({ clickable = false }) {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories/getallcategories`);
        const result = await res.json();

        const boneChinaCat = result.data?.find(cat => 
          cat.name.toLowerCase().includes("bone china") || 
          cat.name.toLowerCase().includes("ceramic")
        );

        if (boneChinaCat?.subCategories) {
          setSubcategories(boneChinaCat.subCategories);
        }
      } catch (err) {
        console.error("Subcategories load nahi hui:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  const handleClick = (subcategoryId) => {
    if (!clickable || loading) return;
    router.push(`/products?subcategory=${subcategoryId}`);
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1698280954292-c955f882486f?w=800',
    'https://images.unsplash.com/photo-1634864418654-f0c877ad7897?w=800',
    '/menu2.jpg',
    'https://images.unsplash.com/photo-1668365139546-fee374c0b678?w=800',
    'https://images.unsplash.com/photo-1551807306-69951ee44e70?w=800',
    'https://images.unsplash.com/photo-1759629523494-b342430f2100?w=800',
  ];

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading collections...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
      {subcategories.map((sub, index) => (
        <div
          key={sub._id}
          onClick={() => handleClick(sub._id)}
          className={`group relative overflow-hidden aspect-[3/4] rounded-md ${
            clickable ? 'cursor-pointer' : ''
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={sub.image || defaultImages[index % defaultImages.length]}
              alt={sub.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.66vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              {sub.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShopByOccasion() {
  return (
    <section id="occasion" className="py-12 lg:py-16">
      <div className="w-full px-4 lg:px-8">
        <div className="relative mb-12 inline-block">
          <h2
            className="text-3xl text-[#172554] pb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontSize: '48px',
            }}
          >
            Shop by Occasion
          </h2>
          <div className="absolute left-0 bottom-0 h-1 bg-pink-500 rounded-full w-full"></div>
        </div>

        <OccasionCards clickable={true} />
      </div>
    </section>
  );
}