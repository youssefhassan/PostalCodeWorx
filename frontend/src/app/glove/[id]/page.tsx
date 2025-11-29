'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Calendar, Tag, Hand, Euro, Coins, Flag, 
  Mail, Send, Loader2, CheckCircle, ArrowLeft, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getGloveListing, getPaymentInfo, contactFinder, reportListing, GloveListingDetail, PaymentInfo } from '@/lib/api';

const sizeLabels: Record<string, string> = {
  xs: 'Extra Small',
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'Extra Large',
  unknown: 'Unknown',
};

const sideLabels: Record<string, string> = {
  left: 'Left hand',
  right: 'Right hand',
  unknown: 'Unknown',
};

export default function GloveDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);
  const isSuccess = searchParams.get('success') === 'true';
  
  const [glove, setGlove] = useState<GloveListingDetail | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Report form
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState<'spam' | 'inappropriate' | 'wrong_location' | 'fake' | 'other'>('spam');
  const [reportDescription, setReportDescription] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gloveData, paymentData] = await Promise.all([
          getGloveListing(id),
          getPaymentInfo(id),
        ]);
        setGlove(gloveData);
        setPaymentInfo(paymentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load glove');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!glove) return;
    
    setSending(true);
    setError(null);
    
    try {
      await contactFinder(glove.id, {
        requester_email: contactEmail,
        requester_name: contactName || undefined,
        message: contactMessage,
      });
      setSent(true);
      setShowContactForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!glove) return;
    
    setReporting(true);
    
    try {
      await reportListing(glove.id, {
        reason: reportReason,
        description: reportDescription || undefined,
      });
      setReported(true);
      setShowReportForm(false);
    } catch (err) {
      // Silently fail reports
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-berlin-200 rounded mb-8" />
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-berlin-200 rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-8 bg-berlin-200 rounded w-3/4" />
                  <div className="h-4 bg-berlin-200 rounded w-1/2" />
                  <div className="h-24 bg-berlin-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !glove) {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="font-display text-2xl text-berlin-900 mb-2">
              Glove Not Found
            </h1>
            <p className="text-berlin-500 mb-6">
              {error || 'This listing may have been removed or doesn\'t exist.'}
            </p>
            <Link 
              href="/search"
              className="inline-flex items-center gap-2 text-postal-600 hover:text-postal-700 font-medium"
            >
              <ArrowLeft size={18} />
              Back to search
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const photoUrl = glove.photo_url.startsWith('http') 
    ? glove.photo_url 
    : `${apiUrl}${glove.photo_url}`;

  return (
    <>
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link 
            href="/search"
            className="inline-flex items-center gap-2 text-berlin-500 hover:text-postal-600 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to search
          </Link>
          
          {/* Success banner */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-glove-50 border border-glove-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-glove-600" size={20} />
              <p className="text-glove-700 font-medium">
                Your glove has been listed! We'll email you when someone contacts you.
              </p>
            </div>
          )}
          
          {/* Sent confirmation */}
          {sent && (
            <div className="mb-6 p-4 bg-glove-50 border border-glove-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-glove-600" size={20} />
              <div>
                <p className="text-glove-700 font-medium">Message sent!</p>
                <p className="text-sm text-glove-600">
                  The finder will receive your message and can contact you back.
                </p>
              </div>
            </div>
          )}
          
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-berlin-100">
              <Image
                src={photoUrl}
                alt={`${glove.color} ${glove.brand || ''} glove`}
                fill
                className="object-cover"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="postal-badge bg-berlin-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
                  {glove.postal_code}
                </span>
              </div>
            </div>
            
            {/* Details */}
            <div>
              <h1 className="font-display text-3xl text-berlin-900 mb-2">
                {glove.color} {glove.brand && <span className="text-berlin-500">· {glove.brand}</span>} Glove
              </h1>
              
              {glove.description && (
                <p className="text-berlin-600 mb-6">{glove.description}</p>
              )}
              
              {/* Meta info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-berlin-600">
                  <Hand size={18} className="text-berlin-400" />
                  <span>{sideLabels[glove.side]}</span>
                </div>
                
                <div className="flex items-center gap-3 text-berlin-600">
                  <Tag size={18} className="text-berlin-400" />
                  <span>Size: {sizeLabels[glove.size]}</span>
                </div>
                
                {glove.material && (
                  <div className="flex items-center gap-3 text-berlin-600">
                    <span className="w-[18px] text-center text-berlin-400">🧵</span>
                    <span>{glove.material}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-berlin-600">
                  <Calendar size={18} className="text-berlin-400" />
                  <span>Found on {format(new Date(glove.found_date), 'MMMM d, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-3 text-berlin-600">
                  <MapPin size={18} className="text-berlin-400" />
                  <span>
                    {glove.postal_code}
                    {glove.found_location_description && ` · ${glove.found_location_description}`}
                  </span>
                </div>
              </div>
              
              {/* Finder's fee */}
              {paymentInfo && paymentInfo.fee_amount > 0 && (
                <div className="p-4 bg-postal-50 rounded-xl mb-6">
                  <h3 className="font-medium text-berlin-900 mb-2">Finder's Fee</h3>
                  <div className="flex items-center gap-2 text-2xl font-bold text-postal-600">
                    {paymentInfo.fee_currency === 'eur' ? (
                      <>
                        <Euro size={24} />
                        {paymentInfo.fee_amount.toFixed(2)}
                      </>
                    ) : (
                      <>
                        <Coins size={24} />
                        {paymentInfo.fee_amount} Postaal
                      </>
                    )}
                  </div>
                  {paymentInfo.fee_currency === 'eur' && paymentInfo.platform_fee > 0 && (
                    <p className="text-xs text-berlin-500 mt-1">
                      + €{paymentInfo.platform_fee.toFixed(2)} platform fee
                    </p>
                  )}
                </div>
              )}
              
              {/* Contact button */}
              {!sent && !showContactForm && (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full py-3 bg-postal-500 hover:bg-postal-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Contact Finder
                </button>
              )}
              
              {/* Contact form */}
              {showContactForm && (
                <form onSubmit={handleContact} className="space-y-4 p-4 bg-berlin-50 rounded-xl">
                  <h3 className="font-medium text-berlin-900">Send a message to the finder</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-berlin-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      minLength={10}
                      rows={3}
                      placeholder="Describe why you think this is your glove..."
                      className="w-full px-3 py-2 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 py-2.5 border border-berlin-200 rounded-lg text-berlin-600 hover:bg-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending || !contactEmail || !contactMessage}
                      className="flex-1 py-2.5 bg-postal-500 hover:bg-postal-600 disabled:bg-berlin-200 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {sending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      Send
                    </button>
                  </div>
                </form>
              )}
              
              {/* Report link */}
              <div className="mt-4 text-center">
                {!showReportForm && !reported && (
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="text-sm text-berlin-400 hover:text-red-500 transition-colors inline-flex items-center gap-1"
                  >
                    <Flag size={14} />
                    Report this listing
                  </button>
                )}
                
                {reported && (
                  <p className="text-sm text-berlin-400">Thanks for the report. We'll review it.</p>
                )}
                
                {showReportForm && (
                  <form onSubmit={handleReport} className="mt-4 p-4 bg-red-50 rounded-xl text-left">
                    <h4 className="font-medium text-red-900 mb-3">Report this listing</h4>
                    
                    <div className="mb-3">
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value as any)}
                        className="w-full px-3 py-2 border border-red-200 rounded-lg"
                      >
                        <option value="spam">Spam / Advertising</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="wrong_location">Wrong location</option>
                        <option value="fake">Fake listing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        rows={2}
                        placeholder="Additional details (optional)"
                        className="w-full px-3 py-2 border border-red-200 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReportForm(false)}
                        className="flex-1 py-2 border border-red-200 rounded-lg text-red-700 hover:bg-red-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={reporting}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                      >
                        {reporting ? 'Reporting...' : 'Submit Report'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}



