'use client';

import Link from 'next/link';
import { Search, Upload, Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-postal-50/80 backdrop-blur-md border-b border-postal-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl wave-emoji">🧤</span>
            <div className="flex flex-col">
              <span className="font-display text-xl text-berlin-900 group-hover:text-postal-600 transition-colors">
                PostalCodeWorx
              </span>
              <span className="text-[10px] uppercase tracking-widest text-berlin-500 -mt-1">
                Glove Finder
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/search" 
              className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
            >
              <Search size={18} />
              Find My Glove
            </Link>
            <Link 
              href="/upload" 
              className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
            >
              <Upload size={18} />
              Found a Glove
            </Link>
            <Link 
              href="/leaderboard" 
              className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
            >
              <Trophy size={18} />
              Leaderboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-postal-200">
            <div className="flex flex-col gap-4">
              <Link 
                href="/search" 
                className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search size={18} />
                Find My Glove
              </Link>
              <Link 
                href="/upload" 
                className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload size={18} />
                Found a Glove
              </Link>
              <Link 
                href="/leaderboard" 
                className="flex items-center gap-2 text-berlin-600 hover:text-postal-600 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Trophy size={18} />
                Leaderboard
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}



