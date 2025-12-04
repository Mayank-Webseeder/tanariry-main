// 'use client';

// import { useState, useEffect, useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Image from 'next/image';
// import { Search, X, LayoutGrid, Grid3x3 } from "lucide-react";
// import ProductCard from "@/components/products/ProductCard";
// import ProductSkeleton from "@/components/products/ProductSkeleton";
// import StayInspired from "@/components/home/StayInspired";
// import Pagination from "@/components/layout/Pagination";
// import { OccasionCards } from '@/components/home/ShopByOccasion';

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// export default function ProductsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [loadingCats, setLoadingCats] = useState(true);
//   const [error, setError] = useState(null);

//   const [activeCat, setActiveCat] = useState(null);
//   const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
//   const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const [viewMode, setViewMode] = useState("grid3");
//   const [sortBy, setSortBy] = useState(() => {
//     const urlSort = searchParams.get("sort");
//     return urlSort || "default";
//   });

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 20;
//   const productsSectionRef = useRef(null);
//   const categoryFromURL = searchParams.get("category");

//   const categoryRef = useRef(null);
// const sortRef = useRef(null);


//   // Outside click handler
// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (categoryRef.current && !categoryRef.current.contains(event.target)) {
//       setCategoryDropdownOpen(false);
//     }
//     if (sortRef.current && !sortRef.current.contains(event.target)) {
//       setSortDropdownOpen(false);
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);


//   // Sync activeCat → selectedCategory
//   useEffect(() => {
//     if (activeCat) {
//       setSelectedCategory(activeCat._id);
//     } else {
//       setSelectedCategory("all");
//     }
//     setCurrentPage(1);
//   }, [activeCat]);

//   useEffect(() => {
//     if (!loadingCats && categoryFromURL && categories.length > 0) {
//       const matchedCat = categories.find(
//         (cat) => cat.name.toLowerCase().replace(/\s+/g, '-') === categoryFromURL.toLowerCase()
//       );
//       if (matchedCat) {
//         setActiveCat(matchedCat);
//       } else {
//         setActiveCat(null);
//       }
//     }
//   }, [categoryFromURL, categories, loadingCats]);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/categories/getallcategories`);
//         if (!res.ok) throw new Error("Failed to load categories. Please try again.");
//         const result = await res.json();
//         setCategories(result.data || []);
//       } catch (err) {
//         console.error("Category Error:", err);
//       } finally {
//         setLoadingCats(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch Products
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch(`${API_BASE}/api/products/getallproducts`, {
//         cache: "no-store",
//         next: { revalidate: 0 }
//       });

//       if (!res.ok) throw new Error(`Server Error: ${res.status}`);

//       const result = await res.json();
//       const rawProducts =
//         Array.isArray(result?.data?.products) ? result.data.products :
//           Array.isArray(result?.data) ? result.data :
//             Array.isArray(result?.products) ? result.products :
//               Array.isArray(result) ? result : [];

//       let filtered = [...rawProducts];

//       if (selectedCategory !== "all") {
//         filtered = filtered.filter((p) => p.category?._id === selectedCategory);
//       }

//       if (selectedSubCategory !== "all") {
//         filtered = filtered.filter((p) => p.subCategoryId === selectedSubCategory);
//       }

//       if (searchQuery.trim()) {
//         const q = searchQuery.toLowerCase().trim();
//         filtered = filtered.filter((p) =>
//           p.productName?.toLowerCase().includes(q) ||
//           p.description?.toLowerCase().includes(q)
//         );
//       }

//       // Sorting
//       switch (sortBy) {
//         case "price-low":
//           filtered.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
//           break;
//         case "price-high":
//           filtered.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
//           break;
//         case "name":
//           filtered.sort((a, b) => a.productName.localeCompare(b.productName));
//           break;
//         case "newest":
//           filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//           break;
//       }

//       setProducts(filtered);
//       setTotalProducts(filtered.length);

//     } catch (err) {
//       console.error("Products fetch error:", err);
//       setError("Failed to load products. Please try again.");
//       setProducts([]);
//       setTotalProducts(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory, selectedSubCategory, sortBy, searchQuery]);

//   // Sync sort with URL
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     if (sortBy === "default") {
//       params.delete("sort");
//     } else {
//       params.set("sort", sortBy);
//     }
//     router.replace(`?${params.toString()}`, { scroll: false });
//   }, [sortBy]);

//   const totalPages = Math.ceil(totalProducts / productsPerPage);
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const gridClass = viewMode === "grid2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";

//   return (
//     <div>
//       <div className="py-8 px-4">
//         <OccasionCards />
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 lg:px-10 py-6">
//         <div className="max-w-xl mx-auto">
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
//             <input
//               type="text"
//               placeholder="Search Tea Set, Dinner Plate..."
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//               className="w-full pl-12 pr-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 text-lg"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
//                 <X className="w-5 h-5 text-gray-400" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div ref={productsSectionRef} className="w-full px-8 lg:px-16 py-16">
//         <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
//           <div className="relative inline-block">
//             <h2 className="text-4xl md:text-5xl font-playfair text-[#172554] font-normal pb-3">
//               {activeCat ? activeCat.name : "All Products"}
//             </h2>
//             <div className="absolute left-0 bottom-0 h-1 bg-pink-300 w-full rounded-full mb-8"></div>
//             <p className="text-gray-600 mt-4">
//               {loading ? "Loading..." : `${totalProducts} products found`}
//             </p>
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//           </div>

//           <div className="flex flex-wrap items-center gap-4 mt-4">
//             {/* Category Dropdown - FIXED */}
//             <div className="relative" ref={categoryRef}>
//               <button
//                 onClick={() => setCategoryDropdownOpen(prev => !prev)}
//                 className="flex items-center justify-between gap-8 px-5 py-2 bg-white border-2 border-pink-500 rounded-lg font-medium text-[#172554] hover:bg-pink-50 transition-all duration-300 min-w-[220px]"
//               >
//                 <span className="truncate">
//                   {activeCat ? activeCat.name : "All Categories"}
//                 </span>
//                 <svg
//                   className={`w-5 h-5 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {categoryDropdownOpen && (
//                 <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-pink-500 rounded-lg shadow-2xl z-50 overflow-hidden">
//                   <button
//                     onClick={() => {
//                       setActiveCat(null);
//                       setSelectedCategory("all");           
//                       setCategoryDropdownOpen(false);
//                       setCurrentPage(1);
//                     }}
//                     className={`w-full text-left px-5 py-2 hover:bg-pink-50 transition-all font-medium ${!activeCat ? "bg-pink-50 text-[#172554]" : "text-[#172554]"}`}
//                   >
//                     All Categories
//                   </button>
//                   {categories?.map((cat) => (
//                     <button
//                       key={cat._id}
//                       onClick={() => {
//                         setActiveCat(cat);
//                         setSelectedCategory(cat._id);         
//                         setCategoryDropdownOpen(false);
//                         setCurrentPage(1);
//                       }}
//                       className={`w-full text-left px-5 py-2 hover:bg-pink-50 transition-all font-medium ${activeCat?._id === cat._id ? "bg-pink-50 text-[#172554]" : "text-[#172554]"}`}
//                     >
//                       {cat.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Sort By Dropdown */}
//             <div className="relative" ref={sortRef}>
//               <button
//                 onClick={() => setSortDropdownOpen(prev => !prev)}
//                 className="flex items-center justify-between gap-8 px-5 py-2 bg-white border-2 border-pink-500 rounded-lg font-medium text-[#172554] hover:bg-pink-50 transition-all duration-300 min-w-[220px]"
//               >
//                 <span>
//                   {sortBy === "default" && "Sort By"}
//                   {sortBy === "newest" && "Newest First"}
//                   {sortBy === "price-low" && "Price: Low to High"}
//                   {sortBy === "price-high" && "Price: High to Low"}
//                   {sortBy === "name" && "Name: A-Z"}
//                 </span>
//                 <svg
//                   className={`w-5 h-5 transition-transform duration-300 ${sortDropdownOpen ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {sortDropdownOpen && (
//                 <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-pink-500 rounded-lg shadow-2xl z-50 overflow-hidden">
//                   {[
//                     { value: "default", label: "Sort By" },
//                     { value: "newest", label: "Newest First" },
//                     { value: "price-low", label: "Price: Low to High" },
//                     { value: "price-high", label: "Price: High to Low" },
//                     { value: "name", label: "Name: A-Z" },
//                   ].map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => {
//                         setSortBy(option.value);
//                         setCurrentPage(1);
//                         setSortDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-6 py-2 hover:bg-pink-50 transition-all font-medium ${sortBy === option.value ? "bg-pink-50 text-[#172554]" : "text-[#172554]"}`}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* View Mode */}
//             <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//               <button
//                 onClick={() => setViewMode("grid2")}
//                 className={`p-3 transition-all ${viewMode === "grid2" ? "bg-[#172554] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
//               >
//                 <LayoutGrid className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode("grid3")}
//                 className={`p-3 transition-all ${viewMode === "grid3" ? "bg-[#172554] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
//               >
//                 <Grid3x3 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className={`grid ${gridClass} gap-8`}>
//           {loading ? (
//             Array(20).fill().map((_, i) => <ProductSkeleton key={i} />)
//           ) : products.length === 0 ? (
//             <div className="col-span-full text-center py-24 text-gray-500 text-xl">
//               No products found. Try different filters.
//             </div>
//           ) : (
//             products
//               .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
//               .map((product) => (
//                 <div key={product._id} className="relative group">
//                   {product.bestSeller && (
//                     <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full z-10">
//                       BEST SELLER
//                     </div>
//                   )}
//                   {product.originalPrice > product.discountPrice && (
//                     <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold rounded-full z-10">
//                       SALE
//                     </div>
//                   )}
//                   <ProductCard product={product} />
//                 </div>
//               ))
//           )}
//         </div>

//         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//       </div>

//       <StayInspired />
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import StayInspired from "@/components/home/StayInspired";
import Pagination from "@/components/layout/Pagination";
import { OccasionCards } from '@/components/home/ShopByOccasion';
import FilterSidebar from "@/components/products/FilterSidebar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [error, setError] = useState(null);

  const [activeCat, setActiveCat] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [viewMode, setViewMode] = useState("grid3");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;
  const productsSectionRef = useRef(null);
  const categoryFromURL = searchParams.get("category");

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories/getallcategories`);
        if (!res.ok) throw new Error("Failed to load categories");
        const result = await res.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // Sync URL category with active category
  useEffect(() => {
    if (!loadingCats && categoryFromURL && categories.length > 0) {
      const matched = categories.find(
        cat => cat.name.toLowerCase().replace(/\s+/g, '-') === categoryFromURL.toLowerCase()
      );
      setActiveCat(matched || null);
    }
  }, [categoryFromURL, categories, loadingCats]);

  // Fetch and filter products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/getallproducts`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");

      const result = await res.json();
      const rawProducts = Array.isArray(result?.data?.products) ? result.data.products
        : Array.isArray(result?.data) ? result.data
        : Array.isArray(result?.products) ? result.products
        : [];

      let filtered = [...rawProducts];

      if (selectedCategory !== "all") {
        filtered = filtered.filter(p => p.category?._id === selectedCategory);
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.productName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }

      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      filtered = filtered.filter(p => {
        const price = p.discountPrice || p.price || 0;
        return price >= min && price <= max;
      });

      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case "name":
          filtered.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setProducts(filtered);
      setTotalProducts(filtered.length);
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    sortBy === "default" ? params.delete("sort") : params.set("sort", sortBy);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [sortBy]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const gridClass = viewMode === "grid2"
    ? "grid-cols-1 md:grid-cols-2"
    : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
    setIsFilterOpen(false);
  };

  return (
    <div className="relative">
      <div className="py-8 px-4">
        <OccasionCards />
      </div>

      {/* Main Content */}
      <div ref={productsSectionRef} className="w-full px-4 lg:px-16 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
           <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-playfair text-[#172554] font-normal pb-3">
             {activeCat ? activeCat.name : "All Products"}
            </h2>
            <div className="absolute left-0 bottom-0 h-1 bg-pink-300 w-full rounded-full mb-8"></div>
             <p className="text-gray-600 mt-4">
              {loading ? "Loading..." : `${totalProducts} products found`}
            </p>
             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         </div>

          {/* Search Bar */}
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
              <input
                type="text"
                placeholder="Search Tea Set, Dinner Plate..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-8 py-2 border-2 border-pink-200 rounded-xl focus:border-pink-500 text-lg outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white border border-pink-300 rounded-lg font-medium text-[#172554] hover:bg-pink-50 transition"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className={`grid ${gridClass} gap-8`}>
          {loading ? (
            Array(20).fill().map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-32 text-gray-500 text-xl">
              No products found. Try adjusting filters.
            </div>
          ) : (
            products
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product) => (
                <div key={product._id} className="relative group">
                  {product.bestSeller && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full z-10">
                      BEST SELLER
                    </span>
                  )}
                  {product.originalPrice > product.discountPrice && (
                    <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold rounded-full z-10">
                      SALE
                    </span>
                  )}
                  <ProductCard product={product} />
                </div>
              ))
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-full flex items-center justify-center gap-3 py-2 bg-white text-[#172554] font-medium rounded-lg border border-pink-300 transition shadow-lg"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setActiveCat={setActiveCat}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onApplyFilters={applyFilters}
      />

      <StayInspired />
    </div>
  );
}