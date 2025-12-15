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
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 20;
  const productsSectionRef = useRef(null);
  const categoryFromURL = searchParams.get("category");
  const subCategoryFromURL = searchParams.get("subcategory"); 

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

  // Sync URL category
  useEffect(() => {
    if (!loadingCats && categoryFromURL && categories.length > 0) {
      const matched = categories.find(
        cat => cat.name.toLowerCase().replace(/\s+/g, '-') === categoryFromURL.toLowerCase()
      );
      if (matched) {
        setActiveCat(matched);
        setSelectedCategory(matched._id);
      }
    }
  }, [categoryFromURL, categories, loadingCats]);

  // Sync URL subcategory
  useEffect(() => {
    if (subCategoryFromURL && subCategoryFromURL !== selectedSubCategory) {
      setSelectedSubCategory(subCategoryFromURL);
    }
  }, [subCategoryFromURL]);

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

      if (selectedSubCategory !== "all") {
        filtered = filtered.filter(p => p.subCategoryId === selectedSubCategory);
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.productName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }

      // Price Range
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      filtered = filtered.filter(p => {
        const price = p.discountPrice || p.price || 0;
        return price >= min && price <= max;
      });

      // Sorting
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
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy, minPrice, maxPrice]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "all") {
      const cat = categories.find(c => c._id === selectedCategory);
      if (cat) {
        params.set("category", cat.name.toLowerCase().replace(/\s+/g, '-'));
      }
    } else {
      params.delete("category");
    }

    selectedSubCategory !== "all" ? params.set("subcategory", selectedSubCategory) : params.delete("subcategory");
    sortBy !== "default" ? params.set("sort", sortBy) : params.delete("sort");

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedCategory, selectedSubCategory, sortBy, categories, router]);

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const gridClass = viewMode === "grid2"
    ? "grid-cols-1 md:grid-cols-3"
    : "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
    setIsFilterOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setActiveCat(null);
    setCurrentPage(1);
    router.replace("/products", { scroll: false });
  };

  // Check if any filter is active
  const isAnyFilterActive = selectedCategory !== "all" ||
    selectedSubCategory !== "all" ||
    searchQuery.trim() !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    sortBy !== "default";

  return (
    <div className="relative">
      <div className="py-8 px-4 ">
        <OccasionCards clickable={true} />
      </div>

      {/* Main Content */}
      <div ref={productsSectionRef} className="w-full px-4 lg:px-16 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-playfair text-[#172554] font-normal">
              {activeCat ? activeCat.name : "All Products"}
            </h2>
            <div className="mt-2 h-1 bg-pink-500 w-full rounded-full"></div>

            <p className="text-gray-600 mt-4">
              {loading ? "Loading..." : `${totalProducts} products found`}
            </p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search Tea Set, Dinner Plate..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-8 py-2 border-2 border-gray-500 rounded-xl focus:border-gray-700 text-lg outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters + Reset Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-3 px-6 py-2 border border-gray-500 rounded-lg font-medium text-[#172554] hover:bg-gray-50 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Reset Button - Only show when filters active */}
            {isAnyFilterActive && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-3 px-3 py-2 border border-gray-500 rounded-lg font-medium text-[#172554] hover:bg-gray-50 transition"
              >
                Reset Filters
              </button>
            )}
          </div>
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

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-3 py-2 bg-white text-[#172554] font-medium rounded-lg border border-pink-300 transition shadow-lg"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* Mobile Reset Button */}
          {isAnyFilterActive && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-3 px-6 py-2 border border-gray-500 rounded-lg font-medium text-[#172554] hover:bg-gray-50 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
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