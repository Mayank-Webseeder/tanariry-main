'use client';

import { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getImageUrl = (path) => {
  if (!path) return "/fallback.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("uploads/")) return `${BACKEND_URL}/${path}`;
  return `${BACKEND_URL}/uploads/${path}`;
};

// Cart Item Component
function CartItem({ item, removeFromCart, updateQuantity, getTotal, currencySymbol }) {
  const rawImage = item.productImages?.[0] || item.image;
  const [imgSrc, setImgSrc] = useState(getImageUrl(rawImage));

  useEffect(() => {
    setImgSrc(getImageUrl(rawImage));
  }, [rawImage]);

  const safeName = item.productName || item.name || "Product";
  const qty = item.quantity || 1;
  const itemTotal = getTotal(item);

  const formattedTotal = currencySymbol === '$'
    ? Number(itemTotal).toFixed(2).replace(/\.00$/, '')
    : Number(itemTotal).toFixed(2);

  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
        <Image
          src={imgSrc}
          alt={safeName}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={() => setImgSrc("/fallback.jpg")}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-2 pr-3">
            {safeName}
          </h4>
          <button
            onClick={() => removeFromCart(item._id || item.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-medium text-sm">
              {item.quantity || 1}
            </span>
            <button
              onClick={() => updateQuantity(item._id || item.id, (item.quantity || 1) + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-semibold text-[#172554]">
            {currencySymbol}{formattedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, cartCount, justRemoved } = useCart();
  const [mounted, setMounted] = useState(false);
  const [visibleCart, setVisibleCart] = useState([]);

  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data?.country || 'IN';
        setIsIndia(countryCode === 'IN');
      })
      .catch(() => {
        setIsIndia(true); // fallback India
      });
  }, []);

  const currencySymbol = isIndia ? '₹' : '$';

  useEffect(() => {
    setMounted(true);
    setVisibleCart(cart);
  }, [cart]);

  // Sync with localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        const updatedCart = e.newValue ? JSON.parse(e.newValue) : [];
        setVisibleCart(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getPrice = (item) => {
    return isIndia
      ? Number(item.discountPrice || item.price || 0)
      : Number(item.discountPriceUSD || item.priceUSD || 0);
  };

  const getTotal = (item) => (getPrice(item) * (item.quantity || 1)).toFixed(2);

  const subtotal = visibleCart.reduce((sum, item) => sum + getPrice(item) * (item.quantity || 1), 0);
  const isEmpty = visibleCart.length === 0;

  useEffect(() => {
    if (justRemoved && isEmpty && isOpen) {
      const timer = setTimeout(() => onClose(), 500);
      return () => clearTimeout(timer);
    }
  }, [justRemoved, isEmpty, isOpen, onClose]);

  return (
    <>
      {/* Smooth Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-500 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#f5f3f0] shadow-2xl z-50 flex flex-col transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } rounded-l-3xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-playfair font-semibold text-[#172554]">
            Your Cart {mounted && cartCount > 0 && `(${cartCount} items)`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mounted ? (
            isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h4>
                <p className="text-gray-500 text-sm mb-8 max-w-xs">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="px-8 py-3 bg-[#172554] text-white rounded-xl font-medium hover:bg-[#1e3a8a] transition-all hover:shadow-lg"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {visibleCart.map((item) => (
                  <CartItem
                    key={item._id || item.id}
                    item={item}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    getTotal={getTotal}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary */}
        {mounted && !isEmpty && (
          <div className="p-6 border-t bg-gradient-to-t from-gray-50 to-white">
            <div className="mb-4">
              <div className="flex justify-between text-lg font-semibold text-[#172554]">
                <span>Subtotal</span>
                <span>{currencySymbol}{subtotal.toFixed(2).replace(/\.00$/, '')}</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Shipping & taxes calculated at checkout
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-4 bg-[#172554] text-white text-center rounded-xl font-semibold hover:bg-[#1e3a8a] transition-all transform hover:scale-[1.02] active:scale-98 shadow-lg"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full py-3 border-2 border-[#172554] text-[#172554] text-center rounded-xl font-medium hover:bg-[#172554]/5 transition"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}