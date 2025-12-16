// 'use client';

// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// export function OccasionCards({ clickable = false }) {
//   const router = useRouter();
//   const [subcategories, setSubcategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/categories/getallcategories`);
//         const result = await res.json();

//         const boneChinaCat = result.data?.find(cat => 
//           cat.name.toLowerCase().includes("bone china") || 
//           cat.name.toLowerCase().includes("ceramic")
//         );

//         if (boneChinaCat?.subCategories) {
//           setSubcategories(boneChinaCat.subCategories);
//         }
//       } catch (err) {
//         console.error("Subcategories load nahi hui:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubcategories();
//   }, []);

//   const handleClick = (subcategoryId) => {
//     if (!clickable || loading) return;
//     router.push(`/products?subcategory=${subcategoryId}`);
//   };

//   const defaultImages = [
//     'https://images.unsplash.com/photo-1698280954292-c955f882486f?w=800',
//     'https://images.unsplash.com/photo-1634864418654-f0c877ad7897?w=800',
//     '/menu2.jpg',
//     'https://images.unsplash.com/photo-1668365139546-fee374c0b678?w=800',
//     'https://images.unsplash.com/photo-1551807306-69951ee44e70?w=800',
//     'https://images.unsplash.com/photo-1759629523494-b342430f2100?w=800',
//   ];

//   if (loading) {
//     return <div className="text-center py-20 text-gray-500">Loading collections...</div>;
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
//       {subcategories.map((sub, index) => (
//         <div
//           key={sub._id}
//           onClick={() => handleClick(sub._id)}
//           className={`group relative overflow-hidden aspect-[3/4] rounded-md ${
//             clickable ? 'cursor-pointer' : ''
//           }`}
//         >
//           <div className="relative w-full h-full">
//             <Image
//               src={sub.image || defaultImages[index % defaultImages.length]}
//               alt={sub.name}
//               fill
//               className="object-cover transition-transform duration-500 group-hover:scale-110"
//               sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16.66vw"
//             />
//           </div>

//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

//           <div className="absolute bottom-0 left-0 right-0 p-4">
//             <h3 className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
//               {sub.name}
//             </h3>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function ShopByOccasion() {
//   return (
//     <section id="occasion" className="py-12 lg:py-16">
//       <div className="w-full px-4 lg:px-8">
//         <div className="relative mb-12 inline-block">
//           <h2
//             className="text-3xl text-[#172554] pb-3"
//             style={{
//               fontFamily: "'Playfair Display', serif",
//               fontWeight: 400,
//               fontSize: '48px',
//             }}
//           >
//             Shop by Occasion
//           </h2>
//           <div className="absolute left-0 bottom-0 h-1 bg-pink-500 rounded-full w-full"></div>
//         </div>

//         <OccasionCards clickable={true} />
//       </div>
//     </section>
//   );
// }
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Updated props: added onAllProductsClick
export function OccasionCards({ clickable = false, onAllProductsClick }) {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories/getallcategories`);
        const result = await res.json();

        const allSubs = [];
        result.data?.forEach(cat => {
          if (cat.subCategories && Array.isArray(cat.subCategories)) {
            allSubs.push(...cat.subCategories);
          }
        });

        setSubcategories(allSubs);
      } catch (err) {
        console.error("Subcategories load nahi hui:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  // Arrow visibility logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateArrows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    };

    updateArrows();
    container.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    return () => {
      container?.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [loading, subcategories]);

  const handleSubClick = (subcategoryId) => {
    if (!clickable || loading) return;
    router.push(`/products?subcategory=${subcategoryId}`);
  };

  // FIXED: Now resets filters via parent callback before navigating
  const handleAllClick = () => {
    if (onAllProductsClick) {
      onAllProductsClick(); // This resets all filters in ProductsContent
    }
    router.push("/products", { scroll: false });
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1721373489867-b95a7b3fe16c?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1731481382640-4859340396a7?q=80&w=687&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1668365139546-fee374c0b678?w=800",
    "https://images.unsplash.com/photo-1551807306-69951ee44e70?w=800",
    "https://images.unsplash.com/photo-1586558284713-ba390c1a042a?q=80&w=687&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
    "https://images.unsplash.com/photo-1738484708927-c1f45df0b56e?q=80&w=1167&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1714841433964-2ea7e12d174a?q=80&w=688&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1714785786480-6437fd5dad55?q=80&w=688&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1760594308330-404765c714b4?q=80&w=686&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154154-9c1c1f6c9c35?w=800",
  ];

  const getImageSrc = (image, index) => {
    return image && image.trim() ? image : defaultImages[index % defaultImages.length];
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.occasion-card');
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.occasion-card');
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    }
  };

  const cardClasses =
    'occasion-card group relative overflow-hidden aspect-[3/4] rounded-md ' +
    'w-[210px] flex-shrink-0 cursor-pointer ' +
    'transition-all duration-300 hover:shadow-xl';

  if (loading) {
    return (
      <div className="flex gap-6 py-2 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-[220px] aspect-[3/4] bg-gray-200 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-2xl rounded-full p-2 transition-all hover:scale-110 hidden md:flex items-center justify-center"
        >
          <ChevronLeft className="w-7 h-7 text-[#172554]" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-2xl rounded-full p-2 transition-all hover:scale-110 hidden md:flex items-center justify-center"
        >
          <ChevronRight className="w-7 h-7 text-[#172554]" />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={scrollRef}
        role="region"
        aria-label="Shop by occasion carousel"
        className="flex gap-6 overflow-x-auto py-6 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* All Products Card */}
        <div onClick={handleAllClick} className={cardClasses}>
          <div className="relative w-full h-full">
            <Image
              src="https://plus.unsplash.com/premium_photo-1680098057188-ed998b438a43?q=80&w=1170&auto=format&fit=crop"
              alt="All Products"
              fill
              className="object-cover scale-110 blur-[2px]"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-[#172554]/80 to-[#1E3A8A]/80" />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex items-center justify-center">
            <h3
              className="text-white text-2xl text-center px-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              All Products
            </h3>
          </div>
        </div>

        {/* Subcategory Cards */}
        {subcategories.map((sub, index) => (
          <div
            key={sub._id}
            onClick={() => handleSubClick(sub._id)}
            className={cardClasses}
          >
            <div className="relative w-full h-full">
              <Image
                src={getImageSrc(sub.image, index)}
                alt={sub.name}
                fill
                sizes="220px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={index < 3}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3
                className="text-white text-xl text-center drop-shadow-md"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {sub.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopByOccasion() {
  return (
    <section id="occasion" className="py-6 lg:py-8">
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

        {/* Pass the reset function from parent (ProductsContent) here when using */}
        <OccasionCards clickable={true} />
      </div>
    </section>
  );
}