// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useCart } from '@/context/CartContext';
// import { useWishlist } from '@/context/WishlistContext';
// import { ShoppingCart, Share2, ChevronLeft, ChevronRight, Star, Sparkles, Package, Palette, Ruler, Shield } from 'lucide-react';
// import toast from 'react-hot-toast';
// import StayInspired from '@/components/home/StayInspired';

// const BACKEND_URL = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "");

// export default function ProductDetailPage({ product }) {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   const { addToCart } = useCart();

//   const getSafeImageUrl = (path) => {
//     if (!path || typeof path !== 'string') return "/fallback.jpg";
//     if (path.startsWith("http")) return path;
//     let cleanPath = path.trim();
//     if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
//     cleanPath = cleanPath.replace(/\/uploads\/uploads/g, "/uploads");
//     return `${BACKEND_URL}${cleanPath}`;
//   };

//   const rawImages = product?.productImages || [];
//   const images = rawImages.length > 0 ? rawImages.map(getSafeImageUrl) : ["/fallback.jpg"];

//   const name = product?.productName || "Coffee Mugs";
//   const desc = product?.description || "Stylish, durable mugs crafted in multiple signature designs.";
//   const discountPrice = Number(product?.discountPrice || 549);
//   const originalPrice = Number(product?.originalPrice || 600);
//   const hasDiscount = originalPrice > discountPrice;
//   const discountPercent = hasDiscount ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

//   const handleAddToCart = () => {
//     addToCart({ ...product, quantity, selectedPrice: discountPrice });
//     toast.success(`${quantity} × ${name} added to cart!`, {
//       style: { background: '#1E3A8A', color: '#fff' }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4  py-8 lg:py-12">

//         {/* Breadcrumb */}
//         <nav className="text-sm text-gray-500 mb-6">
//           <Link href="/" className="hover:text-[#1E3A8A]">Home</Link>
//           <span className="mx-2">›</span>
//           <Link href="/products" className="hover:text-[#1E3A8A]">Products</Link>
//           <span className="mx-2">›</span>
//           <span className="font-medium text-gray-900">{name}</span>
//         </nav>

//         {/* MAIN GRID - Image Left | Rich Content Right */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 sm:px-6 lg:px-6">

//           {/* LEFT - IMAGE GALLERY */}
//           <div className="lg:col-span-5 space-y-2">
//             {/* Main Image */}
//             <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 sticky top-6">
//               <div className="relative aspect-square">
//                 {images.map((img, i) => (
//                   <Image
//                     key={i}
//                     src={img}
//                     alt={name}
//                     fill
//                     className={`object-contain transition-opacity duration-700 ${selectedImage === i ? 'opacity-100' : 'opacity-0'}`}
//                     priority={i === 0}
//                     sizes="(max-width: 1024px) 100vw, 40vw"
//                     onError={(e) => e.currentTarget.src = "/fallback.jpg"}
//                   />
//                 ))}
//                 <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
//                   {selectedImage + 1} / {images.length}
//                 </div>
//               </div>
//             </div>

//             {/* Thumbnails - Mobile Horizontal */}
//             {images.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 lg:hidden">
//                 {images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setSelectedImage(i)}
//                     className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-4 transition-all ${selectedImage === i ? 'border-[#1E3A8A] ring-4 ring-[#1E3A8A]/20' : 'border-gray-300'}`}
//                   >
//                     <Image src={img} alt="" fill className="object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT - FULL RICH CONTENT (NO BLANK SPACE) */}
//           <div className="lg:col-span-7 space-y-4">

//             {/* Title & Rating */}
//             <div>
//               <h1 className="text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
//                 {name}
//               </h1>
//               <div className="flex items-center gap-3 mt-3">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-600">(124 reviews)</span>
//                 <span className="text-green-600 font-medium text-sm">In Stock</span>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="flex items-center gap-4">
//               <span className="text-4xl font-bold text-[#1E3A8A]">₹{discountPrice.toLocaleString('en-IN')}</span>
//               {hasDiscount && (
//                 <>
//                   <span className="text-2xl text-gray-500 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
//                   <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold">{discountPercent}% OFF</span>
//                 </>
//               )}
//             </div>

//             <p className="text-gray-700 leading-relaxed text-base">{desc}</p>

//             {/* Quantity */}
//             <div className="flex items-center gap-5">
//               <span className="font-medium">Quantity:</span>
//               <div className="flex items-center border border-gray-300 rounded-lg">
//                 <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
//                 <span className="w-16 text-center font-bold text-lg">{quantity}</span>
//                 <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4">
//               <button onClick={handleAddToCart} className="flex-1 bg-[#1E3A8A] hover:bg-[#172554] text-white py- rounded-xl font-semibold flex items-center justify-center gap-3 transition shadow-lg">
//                 <ShoppingCart className="w-6 h-6" /> Add to Cart
//               </button>
//               <button className="p-3 rounded-xl border-2 border-gray-300 hover:border-[#1E3A8A] transition"><Share2 className="w-6 h-6" /></button>
//             </div>

//             {/* Delivery Info */}
//             <div className="text-sm text-gray-600 space-y-2 py-4 border-t border-b">
//               <div>• Free Delivery Across India</div>
//               <div>• 7 Days Easy Return</div>
//               <div>• 100% Original Product</div>
//             </div>

//             {/* Product Highlights */}
//             <div className="bg-white rounded-2xl p-6 border">
//                 <h3 className="font-bold text-lg mb-4">Why You'll Love It</h3>
//                 <div className="text-gray-700 text-sm leading-relaxed space-y-3">
//                 <p>Handcrafted from premium quality ceramic and bone china, each piece is designed for daily use while maintaining an elegant touch.</p>
//                 <p>Beautifully packed in a premium gift box – ready to gift your loved ones on any special occasion.</p>
//                 <p>Made with love by skilled Indian artisans, supporting traditional craftsmanship and local communities.</p>
//                 <p>Timeless designs that blend seamlessly with both contemporary and traditional dining aesthetics.</p>
//                 <p>Chip-resistant, durable, and built to last for generations with proper care.</p>
//                 <p>Easy to clean, stain-resistant, and maintains its shine even after years of daily use.</p>
//                 <p>Loved and trusted by over 50,000+ happy families across India.</p>
//               </div>
//               </div>

//             {/* Product Details */}
//             <div className="bg-white rounded-2xl p-6 shadow-md border">
//               <h3 className="font-bold text-lg mb-4">Product Details</h3>
//               <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
//                 <div><span className="font-medium">Material:</span> Fine Bone China</div>
//                 {/* <div><span className="font-medium">Finish:</span> 24K Gold Plated</div> */}
//                 <div><span className="font-medium">Set Includes:</span> 6 Cups, 6 Saucers + More</div>
//                 <div><span className="font-medium">Craft:</span> Hand-painted</div>
//                 <div><span className="font-medium">Care:</span> Gentle hand wash</div>
//                 <div><span className="font-medium">Origin:</span> Jaipur, India</div>
//               </div>
//             </div>
//             {/* Yeh pura "Why You'll Love It" ke neeche paste kar dena, Trust Badge se pehle */}

//             {/* Customer Reviews Section - Tera wala clean style */}
//             <div className="pt-8 space-y-6">
//               <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
              
//               <div className="flex items-center gap-6">
//                 <div className="text-center">
//                   <div className="text-5xl font-bold text-[#1E3A8A]">4.8</div>
//                   <div className="flex justify-center mt-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className={`w-6 h-6 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-amber-500 fill-amber-500 opacity-30'}`} />
//                     ))}
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">Based on 124 reviews</p>
//                 </div>

//                 <div className="flex-1 space-y-2">
//                   {[5, 4, 3, 2, 1].map((rating) => (
//                     <div key={rating} className="flex items-center gap-3">
//                       <span className="text-sm text-gray-600 w-8">{rating} star</span>
//                       <div className="flex-1 bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-[#1E3A8A] h-2 rounded-full transition-all"
//                           style={{ width: rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '2%' : '0%' }}
//                         />
//                       </div>
//                       <span className="text-xs text-gray-500 w-10 text-right">
//                         {rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '2%' : '0%'}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Real Reviews - Clean & Minimal */}
//               <div className="space-y-6 pt-4">
//                 {[
//                   { name: "Priya Sharma", rating: 5, date: "2 days ago", text: "Absolutely stunning! The quality is even better than expected. Perfect gift for my mother-in-law." },
//                   { name: "Rohan Mehta", rating: 5, date: "1 week ago", text: "It has an incredibly premium feel. I’ve been using it daily and there’s not a single chip — absolutely worth every penny!" },
//                   { name: "Anjali Verma", rating: 4, date: "2 weeks ago", text: "The design and packaging are absolutely beautiful. It does require a bit of careful handling, but overall I’m extremely happy with the purchase." },
//                 ].map((review, i) => (
//                   <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                           {review.name.split(' ').map(n => n[0]).join('')}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900">{review.name}</p>
//                           <p className="text-xs text-gray-500">{review.date}</p>
//                         </div>
//                       </div>
//                       <div className="flex">
//                         {[...Array(5)].map((_, j) => (
//                           <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
//                         ))}
//                       </div>
//                     </div>
//                     <p className="text-gray-700 text-sm leading-relaxed mt-2">{review.text}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* <button className="text-[#1E3A8A] font-semibold hover:underline text-sm">
//                 See all reviews →
//               </button> */}
//             </div>

//             {/* Trust Badge */}
//             <div className="bg-gradient-to-r from-[#1E3A8A]/5 to-indigo-50 rounded-2xl p-6 border border-[#1E3A8A]/20 flex items-center gap-4">
//               <Shield className="w-12 h-12 text-[#1E3A8A]" />
//               <div>
//                 <h4 className="font-bold text-gray-900">100% Authentic & Certified</h4>
//                 <p className="text-sm text-gray-600">Direct from master artisans • Hallmark certified</p>
//               </div>
//             </div>

//           </div>
//         </div>

       
//       </div>
//        <div className="mt-20">
//           <StayInspired />
//         </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Share2, ChevronLeft, ChevronRight, Star, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import StayInspired from '@/components/home/StayInspired';
import { useRef } from 'react';

import ProductCard from '@/components/products/ProductCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "");

export default function ProductDetailPage({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const { addToCart } = useCart();
  const intervalRef = useRef(null);

  const getSafeImageUrl = (path) => {
    if (!path || typeof path !== 'string') return "/fallback.jpg";
    if (path.startsWith("http")) return path;
    let cleanPath = path.trim();
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    cleanPath = cleanPath.replace(/\/uploads\/uploads/g, "/uploads");
    return `${BACKEND_URL}${cleanPath}`;
  };

  const rawImages = product?.productImages || [];
  const images = rawImages.length > 0 ? rawImages.map(getSafeImageUrl) : ["/fallback.jpg"];

  const name = product?.productName || "Coffee Mugs";
  const desc = product?.description || "Stylish, durable mugs crafted in multiple signature designs.";
  const discountPrice = Number(product?.discountPrice || 549);
  const originalPrice = Number(product?.originalPrice || 600);
  const hasDiscount = originalPrice > discountPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedPrice: discountPrice });
    toast.success(`${quantity} × ${name} added to cart!`, {
      style: { background: '#1E3A8A', color: '#fff' }
    });
  };

  useEffect(() => {
    if (images.length <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 4000);
    };

    startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handleMouseEnter = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 4000);
    }
  };


  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category?._id) {
        setLoadingRelated(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/getallproducts`);
        const data = await res.json();
        const allProducts = data?.data?.products || data?.data || [];

        const filtered = allProducts
          .filter(p => p.category?._id === product.category._id && p._id !== product._id)
          .slice(0, 8);

        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Related products fetch failed:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product?.category?._id, product?._id]);

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto px-8 py-2 lg:py-4">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1E3A8A]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/products" className="hover:text-[#1E3A8A]">Products</Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-900">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 sm:px-6 lg:px-6">
         <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div 
                className="relative rounded-xl overflow-hidden  "
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative aspect-square rounded-3xl border border-gray-100 overflow-hidden">

                  <div className="absolute inset-0 p-2">

                    {images.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`${name} - Image ${i + 1}`}
                        fill
                        className={`object-contain transition-opacity duration-1000 ease-in-out ${
                          selectedImage === i ? "opacity-100" : "opacity-0"
                        }`}
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                      />
                    ))}
                    {images.length > 1 && (
                      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                        {selectedImage + 1} / {images.length}
                      </div>
                    )}
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="p-4  ">
                    <div className="flex gap-3 justify-start overflow-x-auto scrollbar-hide">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-1 transition-all ${
                            selectedImage === i
                              ? 'border-[#1E3A8A] ring-1 ring-[#1E3A8A]/20 shadow-lg'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(124 reviews)</span>
                <span className="text-green-600 font-medium text-sm">In Stock</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#1E3A8A]">₹{discountPrice.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-gray-500 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                  <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed text-base">{desc}</p>

            <div className="flex items-center gap-5">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
                <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAddToCart} className="flex-1 bg-[#1E3A8A] hover:bg-[#172554] text-white py- rounded-xl font-semibold flex items-center justify-center gap-3 transition shadow-lg">
                <ShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
              <button className="p-3 rounded-xl border-2 border-gray-300 hover:border-[#1E3A8A] transition"><Share2 className="w-6 h-6" /></button>
            </div>

            <div className="text-sm text-gray-600 space-y-2 py-4 border-t border-b">
              <div>• Free Delivery Across India</div>
              <div>• 7 Days Easy Return</div>
              <div>• 100% Original Product</div>
            </div>

            <div className="bg-[#f5f3f0] rounded-2xl p-6 border">
              <h3 className="font-bold text-lg mb-4">Why You'll Love It</h3>
              <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                <p>Handcrafted from premium quality ceramic and bone china, each piece is designed for daily use while maintaining an elegant touch.</p>
                <p>Beautifully packed in a premium gift box – ready to gift your loved ones on any special occasion.</p>
                <p>Made with love by skilled Indian artisans, supporting traditional craftsmanship and local communities.</p>
                <p>Timeless designs that blend seamlessly with both contemporary and traditional dining aesthetics.</p>
                <p>Chip-resistant, durable, and built to last for generations with proper care.</p>
                <p>Easy to clean, stain-resistant, and maintains its shine even after years of daily use.</p>
                <p>Loved and trusted by over 50,000+ happy families across India.</p>
              </div>
            </div>

            <div className="bg-[#f5f3f0] rounded-2xl p-6 shadow-md border">
              <h3 className="font-bold text-lg mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div><span className="font-medium">Material:</span> Fine Bone China</div>
                <div><span className="font-medium">Set Includes:</span> 6 Cups, 6 Saucers + More</div>
                <div><span className="font-medium">Craft:</span> Hand-painted</div>
                <div><span className="font-medium">Care:</span> Gentle hand wash</div>
                <div><span className="font-medium">Origin:</span> Jaipur, India</div>
              </div>
            </div>

            <div className="pt-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#1E3A8A]">4.8</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-amber-500 fill-amber-500 opacity-30'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Based on 124 reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-8">{rating} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-[#1E3A8A] h-2 rounded-full transition-all" style={{ width: rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '2%' : '0%' }} />
                      </div>
                      <span className="text-xs text-gray-500 w-10 text-right">
                        {rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '2%' : '0%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                {[
                  { name: "Priya Sharma", rating: 5, date: "2 days ago", text: "Absolutely stunning! The quality is even better than expected. Perfect gift for my mother-in-law." },
                  { name: "Rohan Mehta", rating: 5, date: "1 week ago", text: "It has an incredibly premium feel. I’ve been using it daily and there’s not a single chip — absolutely worth every penny!" },
                  { name: "Anjali Verma", rating: 4, date: "2 weeks ago", text: "The design and packaging are absolutely beautiful. It does require a bit of careful handling, but overall I’m extremely happy with the purchase." },
                ].map((review, i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A8A] to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-[#1E3A8A]/5 to-indigo-50 rounded-2xl p-6 border border-[#1E3A8A]/20 flex items-center gap-4">
              <Shield className="w-12 h-12 text-[#1E3A8A]" />
              <div>
                <h4 className="font-bold text-gray-900">100% Authentic & Certified</h4>
                <p className="text-sm text-gray-600">Direct from master artisans • Hallmark certified</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              You May Also Like
            </h2>
            <p className="text-gray-600 mt-3 text-lg">More handcrafted treasures from the same collection</p>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg">
              No related products found in this collection.
            </div>
          )}
        </div>
      </div>
      <div className="mt-20">
        <StayInspired />
      </div>
    </div>
  );
}