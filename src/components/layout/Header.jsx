'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';
import CartSidebar from './CartSidebar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
// import WishlistSidebar from './WishlistSidebar';
import { useAuth } from '@/context/AuthContext';


export default function Header() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { cartCount } = useCart();
  const { wishlist } = useWishlist(); 
  const wishlistCount = wishlist.length; 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (authLoading) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm h-16">
        <div className="flex items-center justify-between px-4 lg:px-8 h-full">
          <div className="animate-pulse bg-gray-300 h-10 w-32 rounded" />
          <div className="flex items-center gap-6">
            <div className="animate-pulse bg-gray-300 h-10 w-10 rounded-full" />
            <div className="animate-pulse bg-gray-300 h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  const navLinkClass = (path) =>
    `relative transition-all duration-300 cursor-pointer whitespace-nowrap font-medium inline-block
     ${pathname === path ? 'text-[#1E3A8A]' : 'text-gray-900 hover:text-[#1E3A8A]'}`;

  const underlineStyle = (path) => `
    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-pink-500 after:transition-all after:duration-300 after:origin-center
    ${pathname === path
      ? 'after:w-full'
      : 'hover:after:w-full hover:after:left-0 hover:after:translate-x-0'
    }
  `;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    console.log('Searching for:', searchTerm);
    setSearchTerm('');
    setIsSearchOpen(false);
  };
  const showCartBadge = mounted && cartCount > 0;
  const showWishlistBadge = mounted && wishlistCount > 0; 

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3 sm:gap-4 lg:flex-1">
            {/* Mobile Menu Button - Only on Mobile */}
            <button
              className="lg:hidden p-1.5 text-gray-900 hover:text-[#1E3A8A] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo - Responsive Size */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="TanaRiri Logo"
                className="h-8 w-auto sm:h-8 md:h-10 transition-all duration-200"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav
            className="hidden lg:flex items-center justify-center gap-8 flex-1 absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
          >
            <Link href="/" className={`${navLinkClass('/')} ${underlineStyle('/')}`}>
              Home
            </Link>

            {/* Products Dropdown - Centered Under "Products" */}
            <div className="relative group">
              <div className="flex justify-center">
                <Link href="/products" className={`${navLinkClass('/products')} ${underlineStyle('/products')}`}>
                  Products
                </Link>
              </div>

              {/* 6-Column Mega Dropdown */}
              {/* <div
                className="absolute top-full w-[1450px] ml-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="p-8">
                    <div className="grid grid-cols-6 gap-8 text-sm">

                      <div>
                        <h4 className="font-semibold text-pink-500 mb-4 text-base">Living Room</h4>
                        <ul className="space-y-3 text-gray-600">
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Armchairs</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Coffee Tables</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Sideboards</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Sofas</Link></li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-pink-500 mb-4 text-base">Bedroom</h4>
                        <ul className="space-y-3 text-gray-600">
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Beds</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Nightstands</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Wardrobes</Link></li>
                        </ul>
                      </div>

                 
                      <div>
                        <h4 className="font-semibold text-pink-500 mb-4 text-base">Dining Room</h4>
                        <ul className="space-y-3 text-gray-600">
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Benches</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Dining Chairs</Link></li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-pink-500 mb-4 text-base">Home Decor</h4>
                        <ul className="space-y-3 text-gray-600">
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Mirrors</Link></li>
                          <li><Link href="/products" className="hover:text-[#1E3A8A] transition-colors block">Rugs</Link></li>
                        </ul>
                      </div>

                      <div className="flex flex-col items-center">
                        <Link href="/products" className="group/item block w-full">
                          <div className="overflow-hidden rounded-lg shadow-sm w-full">
                            <img
                              src="/menu1.jpg"
                              alt="Just In"
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover/item:scale-105"
                            />
                          </div>
                          <p className="text-sm font-medium text-center mt-3 text-[#1E3A8A]">Just In</p>
                        </Link>
                      </div>

                      <div className="flex flex-col items-center">
                        <Link href="/products" className="group/item block w-full">
                          <div className="overflow-hidden rounded-lg shadow-sm w-full">
                            <img
                              src="/menu2.jpg"
                              alt="Outlet"
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover/item:scale-105"
                            />
                          </div>
                          <p className="text-sm font-medium text-center mt-3 text-[#1E3A8A]">Outlet</p>
                        </Link>
                      </div>

                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            <Link href="/about" className={`${navLinkClass('/about')} ${underlineStyle('/about')}`}>
              About
            </Link>
            <Link href="/contact" className={`${navLinkClass('/contact')} ${underlineStyle('/contact')}`}>
              Contact
            </Link>
          </nav>

          {/* Right: Search + Icons */}
          <div className="flex items-center justify-end gap-2 lg:gap-3">

            {/* === SEARCH (Responsive) === */}
            {/* <div className={`transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-36 sm:w-40 lg:w-48' : 'w-0'}`}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`h-9 px-3 text-sm border border-gray-300 rounded-md bg-gray-50 w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] ${isSearchOpen ? 'opacity-100' : 'opacity-0 p-0'
                    }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                />
              </form>
            </div> */}

            {/* === Profile === */}
            <ProfileDropdown />

            {/* === Divider (Only on Desktop) === */}
            <div className="hidden lg:block w-px h-6 bg-gray-300" />
            {/* <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center cursor-pointer gap-1 p-1 text-gray-900 hover:text-[#1E3A8A] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>

              {showWishlistBadge && (
                <span
                  className={`
                    absolute -top-1 -right-1 
                    bg-red-500 text-white 
                    rounded-full 
                    flex items-center justify-center 
                    font-medium pointer-events-none 
                    transition-all duration-200
                    w-6 h-6 text-[10px] 
                    sm:w-[18px] sm:h-[18px] sm:text-[11px] 
                    md:w-5 md:h-5 md:text-xs
                  `}
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button> */}

            {/* === CART ICON === */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 p-1 cursor-pointer text-gray-900 hover:text-[#1E3A8A] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              <span
                className="hidden lg:inline-block"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
              >
                Cart
              </span>

              {showCartBadge && (
                <span
                  className={`
                    absolute -top-1 -right-1 
                    bg-[#1E3A8A] text-white 
                    rounded-full 
                    flex items-center justify-center 
                    font-medium pointer-events-none 
                    transition-all duration-200
                    w-6 h-6 text-[10px] 
                    sm:w-[18px] sm:h-[18px] sm:text-[11px] 
                    md:w-5 md:h-5 md:text-xs
                  `}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`${navLinkClass('/')} ${underlineStyle('/')}`} 
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`${navLinkClass('/products')} ${underlineStyle('/products')}`} 
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`${navLinkClass('/about')} ${underlineStyle('/about')}`} 
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`${navLinkClass('/contact')} ${underlineStyle('/contact')}`} 
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '500' }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wishlist Sidebar */}
      {/* <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} /> */}
    </header>
  );
}