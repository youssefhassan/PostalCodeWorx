'use client';

import { useState, useEffect } from 'react';
import { Trophy, MapPin, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostalCodeStats, PostalCodeStats } from '@/lib/api';

export default function LeaderboardPage() {
  const [stats, setStats] = useState<PostalCodeStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPostalCodeStats();
        // Sort by total listings descending
        data.sort((a, b) => b.total_listings - a.total_listings);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const totalGloves = stats.reduce((sum, s) => sum + s.gloves_found, 0);
  const totalClaimed = stats.reduce((sum, s) => sum + s.gloves_claimed, 0);

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="font-display text-4xl md:text-5xl text-berlin-900 mb-3">
              Community Leaderboard
            </h1>
            <p className="text-berlin-500">
              See which Berlin neighborhoods are leading the glove rescue mission
            </p>
          </div>
          
          {/* Overall stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-postal-100">
              <div className="text-3xl font-bold text-postal-600 mb-1">
                {loading ? '...' : totalGloves}
              </div>
              <div className="text-sm text-berlin-500">Gloves Found</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-postal-100">
              <div className="text-3xl font-bold text-glove-600 mb-1">
                {loading ? '...' : totalClaimed}
              </div>
              <div className="text-sm text-berlin-500">Gloves Claimed</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-postal-100">
              <div className="text-3xl font-bold text-berlin-600 mb-1">
                {loading ? '...' : stats.length}
              </div>
              <div className="text-sm text-berlin-500">Active Areas</div>
            </div>
          </div>
          
          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-sm border border-postal-100 overflow-hidden">
            <div className="p-6 border-b border-berlin-100">
              <h2 className="font-display text-xl text-berlin-900 flex items-center gap-2">
                <Trophy className="text-postal-500" size={24} />
                Top Postal Codes
              </h2>
            </div>
            
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-berlin-100" />
                      <div className="flex-1 h-4 bg-berlin-100 rounded" />
                      <div className="w-16 h-4 bg-berlin-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : stats.length > 0 ? (
              <div className="divide-y divide-berlin-100">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.postal_code}
                    className="flex items-center gap-4 p-4 hover:bg-postal-50/50 transition-colors"
                  >
                    {/* Rank */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${index === 1 ? 'bg-gray-100 text-gray-600' : ''}
                      ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                      ${index > 2 ? 'bg-berlin-100 text-berlin-500' : ''}
                    `}>
                      {index + 1}
                    </div>
                    
                    {/* Postal code */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-berlin-400" />
                        <span className="postal-badge text-lg text-berlin-900">
                          {stat.postal_code}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-postal-600">{stat.gloves_found}</div>
                        <div className="text-berlin-400">found</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-glove-600">{stat.gloves_claimed}</div>
                        <div className="text-berlin-400">claimed</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">🧤</div>
                <h3 className="font-display text-xl text-berlin-900 mb-2">
                  No data yet
                </h3>
                <p className="text-berlin-500">
                  Be the first to upload a found glove and start the leaderboard!
                </p>
              </div>
            )}
          </div>
          
          {/* How to earn */}
          <div className="mt-12 p-8 bg-gradient-to-br from-postal-100 to-glove-50 rounded-2xl">
            <h3 className="font-display text-xl text-berlin-900 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-postal-600" />
              How to Climb the Ranks
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl mb-2">📸</div>
                <h4 className="font-medium text-berlin-900 mb-1">Find & Upload</h4>
                <p className="text-sm text-berlin-600">
                  Found a lonely glove? Upload it to help reunite the pair.
                </p>
              </div>
              
              <div>
                <div className="text-2xl mb-2">🤝</div>
                <h4 className="font-medium text-berlin-900 mb-1">Help Reunite</h4>
                <p className="text-sm text-berlin-600">
                  Successfully return a glove to its owner and earn Postaal coins.
                </p>
              </div>
              
              <div>
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-medium text-berlin-900 mb-1">Keep it Clean</h4>
                <p className="text-sm text-berlin-600">
                  Report spam or fake listings to maintain community trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}



