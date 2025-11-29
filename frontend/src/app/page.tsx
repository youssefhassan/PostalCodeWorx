'use client';

import Link from 'next/link';
import { Search, Upload, MapPin, Sparkles, ArrowRight, Hand } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Floating glove emoji */}
              <div className="text-8xl mb-8 animate-float">🧤</div>
              
              <h1 className="font-display text-5xl md:text-7xl text-berlin-900 leading-tight animate-fade-in">
                Lost a glove?
                <br />
                <span className="text-postal-500">Find its pair.</span>
              </h1>
              
              <p className="text-xl text-berlin-600 mt-6 animate-slide-up stagger-1" style={{ opacity: 0 }}>
                PostalCodeWorx connects lost gloves with their owners across Berlin neighborhoods.
                <br className="hidden md:block" />
                Powered by AI. Fueled by community.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-slide-up stagger-2" style={{ opacity: 0 }}>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-postal-500 hover:bg-postal-600 text-white rounded-xl font-medium text-lg transition-all hover:scale-105 shadow-lg shadow-postal-500/20"
                >
                  <Search size={22} />
                  Find My Glove
                </Link>
                
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-berlin-50 text-berlin-900 rounded-xl font-medium text-lg transition-all border-2 border-berlin-200 hover:border-postal-300"
                >
                  <Upload size={22} />
                  I Found a Glove
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🧤</div>
          <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-float" style={{ animationDelay: '2s' }}>🧤</div>
          <div className="absolute top-40 right-20 text-3xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>🧤</div>
        </section>
        
        {/* How it works */}
        <section className="py-20 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl text-berlin-900 text-center mb-12">
              How it works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-postal-100 card-hover">
                <div className="w-14 h-14 rounded-xl bg-postal-100 flex items-center justify-center mb-6">
                  <Upload className="text-postal-600" size={28} />
                </div>
                <h3 className="font-display text-xl text-berlin-900 mb-3">
                  1. Upload a photo
                </h3>
                <p className="text-berlin-500">
                  Found a lonely glove? Snap a photo and upload it. Our AI will identify the brand, color, and size automatically.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-postal-100 card-hover">
                <div className="w-14 h-14 rounded-xl bg-glove-100 flex items-center justify-center mb-6">
                  <Sparkles className="text-glove-600" size={28} />
                </div>
                <h3 className="font-display text-xl text-berlin-900 mb-3">
                  2. AI does the magic
                </h3>
                <p className="text-berlin-500">
                  Claude AI analyzes the glove, detects details, suggests a fair finder's fee, and ensures the listing is legit.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-postal-100 card-hover">
                <div className="w-14 h-14 rounded-xl bg-berlin-100 flex items-center justify-center mb-6">
                  <Hand className="text-berlin-600" size={28} />
                </div>
                <h3 className="font-display text-xl text-berlin-900 mb-3">
                  3. Reunite the pair
                </h3>
                <p className="text-berlin-500">
                  Lost your glove? Search by postal code, color, or brand. Pay a small fee to connect with the finder.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Berlin Focus */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-berlin-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 text-postal-400 mb-4">
                  <MapPin size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider">Currently in Berlin</span>
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  Built for Berlin neighborhoods
                </h2>
                
                <p className="text-berlin-300 mb-8">
                  Every glove is tagged with a postal code. Search by the areas you passed through—Mitte, Kreuzberg, Prenzlauer Berg. The community helps verify locations.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {['10115', '10178', '10997', '10405', '10247'].map((code) => (
                    <span 
                      key={code}
                      className="postal-badge px-4 py-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
                    >
                      {code}
                    </span>
                  ))}
                  <span className="px-4 py-2 text-berlin-400">+ more</span>
                </div>
              </div>
              
              {/* Decorative glove */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[200px] opacity-10">
                🧤
              </div>
            </div>
          </div>
        </section>
        
        {/* Postaal Economy teaser */}
        <section className="py-20 bg-gradient-to-b from-postal-50/50 to-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-berlin-900 mb-4">
              Earn Postaal Coins 🪙
            </h2>
            <p className="text-berlin-600 max-w-2xl mx-auto mb-8">
              Every good deed earns you Postaal—our community currency. Find gloves, help verify photos, 
              report spam. The more you contribute, the more you earn.
            </p>
            
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-postal-600 hover:text-postal-700 font-medium group"
            >
              Start exploring
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}



