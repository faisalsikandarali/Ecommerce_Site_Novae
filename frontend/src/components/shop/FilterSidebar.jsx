import React from 'react';
import { ChevronDown, SlidersHorizontal, RotateCcw, Shirt } from 'lucide-react';

export const FilterSidebar = ({
  filters,
  setFilters,
  onReset,
  totalCount = 0,
  isMobileDrawer = false,
  onCloseMobile
}) => {
  const categories = ['All', 'Clothing', 'Accessories', 'Footwear', 'Backpack'];
  const genders = ['All', 'Men', 'Women'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colorOptions = [
    { name: 'Beige', hex: '#D8CAB8' },
    { name: 'Black', hex: '#111111' },
    { name: 'Grey', hex: '#8C8C8C' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Khaki', hex: '#A89F8B' },
    { name: 'Brown', hex: '#764A23' }
  ];

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-6' : 'w-64 shrink-0'}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-700" />
          <h3 className="font-semibold text-stone-900 text-sm tracking-wide uppercase">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Signature Filter: Hanger Only */}
      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hangerOnly || false}
            onChange={(e) => setFilters(prev => ({ ...prev, hangerOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
          />
          <span className="text-xs font-semibold text-amber-950 flex items-center gap-1">
            <Shirt className="w-3.5 h-3.5 text-amber-700" />
            Hanger Items Only
          </span>
        </label>
        <p className="text-[10px] text-amber-700/80 mt-1 pl-6">
          Show garments with interactive physics hanger animations.
        </p>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => setFilters(prev => ({ ...prev, category: cat }))}
                className="w-3.5 h-3.5 text-stone-900 focus:ring-stone-900 border-stone-300"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender / Department Filter */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Department
        </h4>
        <div className="space-y-2">
          {genders.map((gen) => (
            <label key={gen} className="flex items-center gap-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gen}
                onChange={() => setFilters(prev => ({ ...prev, gender: gen }))}
                className="w-3.5 h-3.5 text-stone-900 focus:ring-stone-900 border-stone-300"
              />
              <span>{gen}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Price Range
        </h4>
        <div className="space-y-2">
          {[
            { label: 'All Prices', min: 0, max: 15000 },
            { label: 'Under Rs. 2,500', min: 0, max: 2500 },
            { label: 'Rs. 2,500 - Rs. 4,500', min: 2500, max: 4500 },
            { label: 'Rs. 4,500+', min: 4500, max: 15000 }
          ].map((range, idx) => (
            <label key={idx} className="flex items-center gap-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max }))}
                className="w-3.5 h-3.5 text-stone-900 focus:ring-stone-900 border-stone-300"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size Pills */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const isSelected = filters.size === s;
            return (
              <button
                key={s}
                onClick={() => setFilters(prev => ({ ...prev, size: isSelected ? '' : s }))}
                className={`w-9 h-9 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Swatches */}
      <div>
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
          Color
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {colorOptions.map((c) => {
            const isSelected = filters.color === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setFilters(prev => ({ ...prev, color: isSelected ? '' : c.name }))}
                style={{ backgroundColor: c.hex }}
                className={`w-6 h-6 rounded-full border transition-all ${
                  isSelected
                    ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                    : 'border-stone-300 hover:scale-105'
                }`}
                title={c.name}
              />
            );
          })}
        </div>
      </div>

      {isMobileDrawer && (
        <button
          onClick={onCloseMobile}
          className="w-full py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider mt-6"
        >
          View Results ({totalCount})
        </button>
      )}
    </div>
  );
};
