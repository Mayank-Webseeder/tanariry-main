// components/products/FilterSidebar.jsx
import { X, LayoutGrid, Grid3x3 } from "lucide-react";

export default function FilterSidebar({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  setActiveCat,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onApplyFilters,
}) {
  // Reset all filters
  const handleReset = () => {
    setSelectedCategory("all");
    setActiveCat(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setViewMode("grid3");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar - Only left corners rounded */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out rounded-l-3xl overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#172554]/10 px-6 py-5 flex items-center justify-between">
          <h3 className="text-2xl font-playfair text-[#172554] font-semibold">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-160px)]">
          {/* Category */}
          <div>
            <h4 className="text-lg font-semibold text-[#172554] mb-5">Category</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "all"}
                  onChange={() => {
                    setSelectedCategory("all");
                    setActiveCat(null);
                  }}
                  className="w-5 h-5 text-[#172554] focus:ring-[#172554] rounded-full"
                />
                <span className="text-gray-700 group-hover:text-[#172554] transition">All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat._id}
                    onChange={() => {
                      setSelectedCategory(cat._id);
                      setActiveCat(cat);
                    }}
                    className="w-5 h-5 text-[#172554] focus:ring-[#172554] rounded-full"
                  />
                  <span className="text-gray-700 group-hover:text-[#172554] transition">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-lg font-semibold text-[#172554] mb-5">Price Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-5 py-2 border border-gray-200 rounded-xl focus:border-[#172554] focus:ring-4 focus:ring-[#172554]/10 outline-none transition"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-5 py-2 border border-gray-200 rounded-xl focus:border-[#172554] focus:ring-4 focus:ring-[#172554]/10 outline-none transition"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h4 className="text-lg font-semibold text-[#172554] mb-5">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#172554] focus:ring-4 focus:ring-[#172554]/10 outline-none transition"
            >
              <option value="default">Recommended</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          {/* View Mode */}
          <div>
            <h4 className="text-lg font-semibold text-[#172554] mb-5">View As</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setViewMode("grid2")}
                className={`py-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  viewMode === "grid2"
                    ? "border-[#172554] bg-[#172554]/5 text-[#172554] shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <LayoutGrid className="w-7 h-7" />
                <span className="font-medium">2 Columns</span>
              </button>
              <button
                onClick={() => setViewMode("grid3")}
                className={`py-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  viewMode === "grid3"
                    ? "border-[#172554] bg-[#172554]/5 text-[#172554] shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Grid3x3 className="w-7 h-7" />
                <span className="font-medium">5 Columns</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons - Reset + Apply */}
        <div className="sticky bottom-0 bg-white border-t border-[#172554]/10 px-6 py-5">
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleReset();
                onApplyFilters();
                onClose();
              }}
              className="flex-1 py-2 border-2 border-[#172554] text-[#172554] font-semibold rounded-xl hover:bg-[#172554]/5 active:scale-95 transition-all duration-200"
            >
              Reset
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-1 py-2 bg-[#172554] text-white font-semibold rounded-xl hover:bg-[#172554]/90 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}