'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Hand, Palette, Tag, Calendar, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GloveCard from '@/components/GloveCard';
import { searchGloves, GloveListing } from '@/lib/api';

const SIZES = [
  { value: '', label: 'Any size' },
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
];

const SIDES = [
  { value: '', label: 'Any hand' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

const COLORS = [
  'Black', 'Brown', 'Grey', 'Navy', 'Red', 'Green', 'Blue', 'White', 'Beige', 'Pink'
];

export default function SearchPage() {
  const [gloves, setGloves] = useState<GloveListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [postalCode, setPostalCode] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [side, setSide] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchGloves = async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof searchGloves>[0] = {
        page,
        per_page: 12,
      };
      
      if (postalCode) params.postal_codes = postalCode.split(',').map(c => c.trim());
      if (brand) params.brand = brand;
      if (color) params.color = color;
      if (size) params.size = size;
      if (side) params.side = side;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      
      const response = await searchGloves(params);
      setGloves(response.items);
      setTotalPages(response.total_pages);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch gloves:', error);
      setGloves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGloves();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGloves();
  };

  const clearFilters = () => {
    setPostalCode('');
    setBrand('');
    setColor('');
    setSize('');
    setSide('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = postalCode || brand || color || size || side || dateFrom || dateTo;

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-berlin-900 mb-3">
              Find Your Lost Glove
            </h1>
            <p className="text-berlin-500">
              Search by postal code, color, brand, or the day you lost it
            </p>
          </div>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-postal-100 p-4 md:p-6">
              {/* Main search bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-berlin-400" />
                  <input
                    type="text"
                    placeholder="Postal codes (e.g., 10115, 10178)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-berlin-200 rounded-xl focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20 transition-all"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-colors ${
                    showFilters || hasActiveFilters
                      ? 'bg-postal-50 border-postal-300 text-postal-700'
                      : 'border-berlin-200 text-berlin-600 hover:border-berlin-300'
                  }`}
                >
                  <Filter size={18} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-postal-500" />
                  )}
                </button>
                
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-postal-500 hover:bg-postal-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
              
              {/* Expanded filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-berlin-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Nike, North Face"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Color
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      >
                        <option value="">Any color</option>
                        {COLORS.map(c => (
                          <option key={c} value={c.toLowerCase()}>{c}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Size
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      >
                        {SIZES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Side */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Hand
                      </label>
                      <select
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      >
                        {SIDES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Date from */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Found after
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    {/* Date to */}
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Found before
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                  </div>
                  
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 flex items-center gap-2 text-sm text-berlin-500 hover:text-postal-600"
                    >
                      <X size={14} />
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>
          
          {/* Results */}
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-berlin-500">
                {loading ? 'Searching...' : `${total} glove${total !== 1 ? 's' : ''} found`}
              </p>
            </div>
            
            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-berlin-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-berlin-100 rounded w-3/4" />
                      <div className="h-3 bg-berlin-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : gloves.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gloves.map((glove) => (
                  <GloveCard key={glove.id} glove={glove} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-berlin-900 mb-2">
                  No gloves found
                </h3>
                <p className="text-berlin-500 max-w-md mx-auto">
                  Try adjusting your filters or searching different postal codes. 
                  New gloves are added every day!
                </p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-berlin-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-postal-300 transition-colors"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-berlin-600">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-berlin-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-postal-300 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}



