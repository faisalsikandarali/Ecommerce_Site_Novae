import React, { useState, useMemo } from 'react';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { ProductCard } from '../components/shop/ProductCard';
import { HangerCard } from '../components/hanger/HangerCard';
import { LayoutGrid, Shirt, SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';

export const ShopPage = ({ products, onSelectProduct, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    category: 'All',
    gender: 'All',
    minPrice: 0,
    maxPrice: 15000,
    size: '',
    color: '',
    rating: 0,
    search: '',
    hangerOnly: false,
    ...initialFilters
  });

  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'hanger'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.hangerOnly && !p.isHangerItem) return false;
      if (filters.category !== 'All' && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.gender !== 'All' && p.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
      if (filters.size && (!p.sizes || !p.sizes.includes(filters.size))) return false;
      if (filters.color && (!p.colors || !p.colors.some(c => c.name.toLowerCase().includes(filters.color.toLowerCase())))) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    });
  }, [products, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      category: 'All',
      gender: 'All',
      minPrice: 0,
      maxPrice: 15000,
      size: '',
      color: '',
      rating: 0,
      search: '',
      hangerOnly: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb / Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-stone-400 mb-1">
            <span>Home</span> <span className="mx-1">/</span> <span className="text-stone-800 font-medium">Shop</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Curated Wardrobe Catalog
          </h1>
        </div>

        {/* View mode toggle (Grid vs Hanger View) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('hanger')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'hanger'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Hanger View 👔</span>
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden p-2 px-3 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white rounded-2xl p-4 mb-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products in this collection..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter and Sort Dropdown */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> products
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="flex items-start gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            totalCount={filteredProducts.length}
          />
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 my-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-3">
                <Shirt className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                No matching pieces found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                Try loosening your filter criteria or searching for another keyword.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'hanger' ? (
            /* Hanger Wardrobe Grid Mode: All products displayed as clothes hanging on coat hangers! */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-4">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className="pt-2">
                  <HangerCard
                    product={product}
                    index={idx}
                    onSelect={onSelectProduct}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Modern Clean E-Commerce Grid Mode */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 text-sm uppercase">Filter Products</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={resetFilters}
              totalCount={filteredProducts.length}
              isMobileDrawer={true}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
