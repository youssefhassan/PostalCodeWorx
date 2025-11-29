'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Tag, Hand, Coins, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { GloveListing } from '@/lib/api';

interface GloveCardProps {
  glove: GloveListing;
}

const sizeLabels: Record<string, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
  unknown: '?',
};

const sideLabels: Record<string, string> = {
  left: 'Left',
  right: 'Right',
  unknown: '?',
};

export default function GloveCard({ glove }: GloveCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const photoUrl = glove.photo_url.startsWith('http') 
    ? glove.photo_url 
    : `${apiUrl}${glove.photo_url}`;

  return (
    <Link href={`/glove/${glove.id}`}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-postal-100 card-hover">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-berlin-100">
          <Image
            src={photoUrl}
            alt={`${glove.color} ${glove.brand || ''} glove`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Postal code badge */}
          <div className="absolute top-3 left-3">
            <span className="postal-badge bg-berlin-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-sm">
              {glove.postal_code}
            </span>
          </div>
          
          {/* Fee badge */}
          {glove.fee_amount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 bg-glove-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-sm font-medium">
                {glove.fee_currency === 'eur' ? (
                  <>
                    <Euro size={14} />
                    {glove.fee_amount.toFixed(2)}
                  </>
                ) : (
                  <>
                    <Coins size={14} />
                    {glove.fee_amount}
                  </>
                )}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-medium text-berlin-900 group-hover:text-postal-600 transition-colors">
            {glove.color} {glove.brand && <span className="text-berlin-500">· {glove.brand}</span>}
          </h3>
          
          {/* Description */}
          {glove.description && (
            <p className="text-sm text-berlin-500 mt-1 line-clamp-2">
              {glove.description}
            </p>
          )}
          
          {/* Meta */}
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-berlin-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(glove.found_date), 'MMM d, yyyy')}
            </span>
            
            <span className="flex items-center gap-1">
              <Hand size={12} />
              {sideLabels[glove.side]}
            </span>
            
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {sizeLabels[glove.size]}
            </span>
          </div>
          
          {/* Location */}
          {glove.found_location_description && (
            <div className="flex items-center gap-1 mt-2 text-xs text-berlin-400">
              <MapPin size={12} />
              <span className="truncate">{glove.found_location_description}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}



