import Link from 'next/link';
import { Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-postal-200 bg-postal-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-berlin-500 text-sm">
            <span>Made with</span>
            <Heart size={14} className="text-postal-500 fill-current" />
            <span>for Berlin neighborhoods</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-berlin-500">
            <Link href="/about" className="hover:text-postal-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-postal-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-postal-600 transition-colors">
              Terms
            </Link>
          </div>
          
          <div className="text-sm text-berlin-400">
            © 2024 PostalCodeWorx
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-postal-200 text-center">
          <p className="text-xs text-berlin-400">
            🧤 Saving lonely gloves across Berlin, one postal code at a time
          </p>
        </div>
      </div>
    </footer>
  );
}



