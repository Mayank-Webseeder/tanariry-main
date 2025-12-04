'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { useWishlist } from '@/context/WishlistContext';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/getallproducts`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load products");
        const result = await res.json();

        const products =
          Array.isArray(result?.data?.products) ? result.data.products :
            Array.isArray(result?.data) ? result.data :
              Array.isArray(result?.products) ? result.products :
                Array.isArray(result) ? result : [];

        if (products.length === 0) {
          setFeatured([]);
          return;
        }

        const top5 = [...products]
          .sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0))
          .slice(0, 5);

        setFeatured(top5);
      } catch (err) {
        console.error("Featured Products Error:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-12 lg:py-16">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Heading + Underline */}
          <div className="relative inline-block">
            <h2
              className="text-[#172554] pb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontSize: '48px',
              }}
            >
              Explore Products
            </h2>
            <div className="absolute left-0 bottom-0 h-1 bg-pink-300 rounded-full w-full"></div>
          </div>

          {/* View All Button - Always Visible */}
          <Link
            href="/products"
            className="px-3 py-1.5 border border-pink-500 text-[#1E3A8A] rounded-md hover:bg-white transition-all duration-300 text-sm md:text-[15px] font-medium whitespace-nowrap self-start sm:self-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            View All
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {loading
            ? Array(5)
              .fill()
              .map((_, i) => <ProductSkeleton key={i} />)
            : featured.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  productName: product.productName,
                  discountPrice: Number(product.discountPrice),
                  originalPrice: product.originalPrice
                    ? Number(product.originalPrice)
                    : null,
                  productImages: Array.isArray(product.productImages)
                    ? product.productImages
                    : [product.productImages || product.image],
                  hoverImage:
                    product.productImages?.[1] ||
                    product.productImagesHover?.[0],
                  isNew: product.isNew || false,
                  bestSeller: product.bestSeller || false,
                  _id: product._id,
                }}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
