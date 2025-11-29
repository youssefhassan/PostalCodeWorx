'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Calendar, Euro, Coins, Check, Loader2, Cpu, Eye, Palette, Ruler, Hand, Tag, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/ImageUpload';
import { analyzeGloveImage, uploadGlove, GloveAnalysis } from '@/lib/api';

// AI Analysis Animation Component
function AIAnalysisOverlay({ 
  isAnalyzing, 
  analysis, 
  onContinue 
}: { 
  isAnalyzing: boolean; 
  analysis: GloveAnalysis | null;
  onContinue: () => void;
}) {
  const [showResults, setShowResults] = useState(false);
  const [revealedItems, setRevealedItems] = useState<number>(0);

  useEffect(() => {
    if (analysis && !isAnalyzing) {
      setShowResults(true);
      // Stagger reveal each detected item
      const items = 6;
      for (let i = 0; i <= items; i++) {
        setTimeout(() => setRevealedItems(i), i * 300);
      }
    }
  }, [analysis, isAnalyzing]);

  if (!isAnalyzing && !showResults) return null;

  const detectedItems = analysis ? [
    { icon: Eye, label: 'Valid Glove', value: analysis.is_valid_glove ? '✓ Detected' : '✗ Not a glove', color: analysis.is_valid_glove ? 'text-glove-500' : 'text-red-500' },
    { icon: Tag, label: 'Brand', value: analysis.brand || 'Unknown', color: 'text-postal-500' },
    { icon: Palette, label: 'Color', value: analysis.color, color: 'text-blue-500' },
    { icon: Ruler, label: 'Size', value: analysis.size.toUpperCase(), color: 'text-purple-500' },
    { icon: Hand, label: 'Hand', value: analysis.side === 'left' ? 'Left' : analysis.side === 'right' ? 'Right' : 'Unknown', color: 'text-orange-500' },
    { icon: Euro, label: 'Est. Value', value: analysis.suggested_price_eur ? `€${analysis.suggested_price_eur}` : 'N/A', color: 'text-glove-500' },
  ] : [];

  const confidence = analysis?.is_valid_glove && analysis?.moderation_passed ? 92 : 0;

  return (
    <div className="fixed inset-0 bg-berlin-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-postal-500 to-postal-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-white/20 rounded-xl ${isAnalyzing ? 'animate-pulse' : ''}`}>
              <Cpu size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Claude AI Analysis</h2>
              <p className="text-postal-100 text-sm">
                {isAnalyzing ? 'Scanning glove details...' : 'Analysis complete!'}
              </p>
            </div>
          </div>
        </div>

        {/* Scanning animation */}
        {isAnalyzing && (
          <div className="p-8">
            <div className="relative h-48 bg-berlin-100 rounded-xl overflow-hidden">
              {/* Scanning line */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-postal-500 to-transparent animate-scan" 
                     style={{ animation: 'scan 2s ease-in-out infinite' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 size={48} className="animate-spin text-postal-500 mx-auto mb-3" />
                  <p className="text-berlin-600 font-medium">Analyzing with Claude AI...</p>
                  <p className="text-berlin-400 text-sm mt-1">Detecting brand, color, size</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && analysis && (
          <div className="p-6">
            {/* Confidence meter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-berlin-600">Detection Confidence</span>
                <span className="text-2xl font-bold text-glove-500">{confidence}%</span>
              </div>
              <div className="h-3 bg-berlin-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-glove-400 to-glove-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: revealedItems > 0 ? `${confidence}%` : '0%' }}
                />
              </div>
            </div>

            {/* Detected items grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {detectedItems.map((item, index) => (
                <div 
                  key={item.label}
                  className={`p-3 bg-berlin-50 rounded-xl border border-berlin-100 transition-all duration-300 ${
                    revealedItems > index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon size={16} className={item.color} />
                    <span className="text-xs text-berlin-400 uppercase tracking-wide">{item.label}</span>
                  </div>
                  <p className={`font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {analysis.description && revealedItems >= 6 && (
              <div className="p-4 bg-postal-50 rounded-xl mb-6 animate-fade-in">
                <p className="text-sm text-berlin-700 italic">"{analysis.description}"</p>
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={onContinue}
              className={`w-full py-4 bg-glove-500 hover:bg-glove-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                revealedItems >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Zap size={20} />
              Continue with these details
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'unknown', label: 'Unknown' },
];

const SIDES = [
  { value: 'left', label: 'Left hand' },
  { value: 'right', label: 'Right hand' },
  { value: 'unknown', label: 'Unknown' },
];

export default function UploadPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<'photo' | 'details' | 'submit'>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GloveAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('unknown');
  const [side, setSide] = useState('unknown');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [finderEmail, setFinderEmail] = useState('');
  const [finderName, setFinderName] = useState('');
  const [feeAmount, setFeeAmount] = useState(0);
  const [feeCurrency, setFeeCurrency] = useState<'postaal' | 'eur'>('postaal');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const [showAIOverlay, setShowAIOverlay] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setShowAIOverlay(true);
    setError(null);
    
    try {
      const result = await analyzeGloveImage(file);
      setAnalysis(result);
      setAnalyzing(false); // Stop analyzing but keep overlay to show results
      
      if (!result.is_valid_glove) {
        setTimeout(() => {
          setShowAIOverlay(false);
          setError('This doesn\'t appear to be a glove. Please upload a clear photo of a glove.');
        }, 2000);
        return;
      }
      
      if (!result.moderation_passed) {
        setTimeout(() => {
          setShowAIOverlay(false);
          setError(result.moderation_notes || 'Image failed moderation. Please upload a different photo.');
        }, 2000);
        return;
      }
      
      // Pre-fill form with AI results
      setBrand(result.brand || '');
      setColor(result.color);
      setSize(result.size);
      setSide(result.side);
      setMaterial(result.material || '');
      setDescription(result.description);
      
      if (result.suggested_price_eur) {
        setFeeAmount(result.suggested_price_eur);
        setFeeCurrency('eur');
      }
      
    } catch (err) {
      setAnalyzing(false);
      setShowAIOverlay(false);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    }
  };

  const handleAIContinue = () => {
    setShowAIOverlay(false);
    setStep('details');
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setStep('photo');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brand', brand);
      formData.append('color', color);
      formData.append('size', size);
      formData.append('side', side);
      formData.append('material', material);
      formData.append('description', description);
      formData.append('postal_code', postalCode);
      formData.append('found_date', new Date(foundDate).toISOString());
      formData.append('found_location_description', foundLocation);
      formData.append('finder_email', finderEmail);
      formData.append('finder_display_name', finderName);
      formData.append('fee_amount', feeAmount.toString());
      formData.append('fee_currency', feeCurrency);
      
      if (analysis) {
        formData.append('ai_analysis', JSON.stringify(analysis));
      }
      
      const listing = await uploadGlove(formData);
      router.push(`/glove/${listing.id}?success=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload glove');
    } finally {
      setSubmitting(false);
    }
  };

  const isValidPostalCode = postalCode.length === 5 && postalCode.startsWith('1');

  return (
    <>
      <Header />
      
      {/* AI Analysis Overlay */}
      {showAIOverlay && (
        <AIAnalysisOverlay 
          isAnalyzing={analyzing}
          analysis={analysis}
          onContinue={handleAIContinue}
        />
      )}
      
      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-berlin-900 mb-3">
              Found a Glove? 🧤
            </h1>
            <p className="text-berlin-500">
              Help reunite it with its owner. AI will analyze the photo for you.
            </p>
          </div>
          
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {['Photo', 'Details', 'Confirm'].map((label, i) => {
              const stepNum = i + 1;
              const currentStepNum = step === 'photo' ? 1 : step === 'details' ? 2 : 3;
              const isActive = stepNum === currentStepNum;
              const isComplete = stepNum < currentStepNum;
              
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${isComplete ? 'bg-glove-500 text-white' : ''}
                    ${isActive ? 'bg-postal-500 text-white' : ''}
                    ${!isActive && !isComplete ? 'bg-berlin-100 text-berlin-400' : ''}
                  `}>
                    {isComplete ? <Check size={16} /> : stepNum}
                  </div>
                  <span className={isActive ? 'text-berlin-900 font-medium' : 'text-berlin-400'}>
                    {label}
                  </span>
                  {i < 2 && <div className="w-8 h-px bg-berlin-200 ml-2" />}
                </div>
              );
            })}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}
          
          {/* Step 1: Photo */}
          {step === 'photo' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-postal-100">
              <ImageUpload
                onFileSelect={handleFileSelect}
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzing}
                preview={preview}
                onClear={handleClear}
              />
              
              {preview && !analyzing && (
                <div className="mt-4 p-4 bg-postal-50 rounded-xl flex items-center gap-3">
                  <Sparkles className="text-postal-500" size={20} />
                  <p className="text-sm text-postal-700">
                    Click "Analyze with AI" to detect brand, color, and size automatically
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Details */}
          {step === 'details' && (
            <form onSubmit={(e) => { e.preventDefault(); setStep('submit'); }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-postal-100 space-y-6">
                {/* AI Results banner */}
                {analysis && (
                  <div className="p-4 bg-glove-50 rounded-xl border border-glove-200">
                    <div className="flex items-center gap-2 text-glove-700 font-medium mb-2">
                      <Sparkles size={18} />
                      AI Analysis Complete
                    </div>
                    <p className="text-sm text-glove-600">
                      We've pre-filled the details below. Feel free to adjust if needed.
                    </p>
                  </div>
                )}
                
                {/* Glove details */}
                <div>
                  <h3 className="font-medium text-berlin-900 mb-4">Glove Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g., Nike, North Face"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Color *
                      </label>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                        placeholder="e.g., Black, Navy blue"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
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
                    
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Which hand? *
                      </label>
                      <select
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      >
                        {SIDES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="e.g., Leather, Wool, Synthetic"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Any additional details about the glove..."
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Location & Time */}
                <div>
                  <h3 className="font-medium text-berlin-900 mb-4">Where & When</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        <MapPin size={14} className="inline mr-1" />
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        maxLength={5}
                        placeholder="e.g., 10115"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition-colors ${
                          postalCode && !isValidPostalCode
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-berlin-200 focus:border-postal-500 focus:ring-postal-500/20'
                        }`}
                      />
                      {postalCode && !isValidPostalCode && (
                        <p className="text-xs text-red-500 mt-1">
                          Must be a Berlin postal code (5 digits starting with 1)
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        <Calendar size={14} className="inline mr-1" />
                        Date Found *
                      </label>
                      <input
                        type="date"
                        value={foundDate}
                        onChange={(e) => setFoundDate(e.target.value)}
                        required
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Location Description
                      </label>
                      <input
                        type="text"
                        value={foundLocation}
                        onChange={(e) => setFoundLocation(e.target.value)}
                        placeholder="e.g., Near Alexanderplatz U-Bahn station"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('photo')}
                    className="flex-1 py-3 border border-berlin-200 rounded-xl font-medium text-berlin-600 hover:bg-berlin-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!color || !isValidPostalCode || !foundDate}
                    className="flex-1 py-3 bg-postal-500 hover:bg-postal-600 disabled:bg-berlin-200 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Step 3: Confirm */}
          {step === 'submit' && (
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-postal-100 space-y-6">
                {/* Your info */}
                <div>
                  <h3 className="font-medium text-berlin-900 mb-4">Your Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={finderEmail}
                        onChange={(e) => setFinderEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                      <p className="text-xs text-berlin-400 mt-1">
                        We'll send you a message when someone wants to claim the glove
                      </p>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={finderName}
                        onChange={(e) => setFinderName(e.target.value)}
                        placeholder="e.g., GloveFinder_10115"
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Finder's fee */}
                <div>
                  <h3 className="font-medium text-berlin-900 mb-4">Finder's Fee (Optional)</h3>
                  <p className="text-sm text-berlin-500 mb-4">
                    Set a small fee for your good deed. The owner pays this to contact you.
                  </p>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 border border-berlin-200 rounded-lg focus:border-postal-500 focus:ring-2 focus:ring-postal-500/20"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-berlin-700 mb-2">
                        Currency
                      </label>
                      <div className="flex rounded-lg border border-berlin-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setFeeCurrency('postaal')}
                          className={`flex items-center gap-2 px-4 py-2.5 transition-colors ${
                            feeCurrency === 'postaal'
                              ? 'bg-postal-500 text-white'
                              : 'bg-white text-berlin-600 hover:bg-berlin-50'
                          }`}
                        >
                          <Coins size={16} />
                          Postaal
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeeCurrency('eur')}
                          className={`flex items-center gap-2 px-4 py-2.5 transition-colors ${
                            feeCurrency === 'eur'
                              ? 'bg-postal-500 text-white'
                              : 'bg-white text-berlin-600 hover:bg-berlin-50'
                          }`}
                        >
                          <Euro size={16} />
                          EUR
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {feeCurrency === 'eur' && feeAmount > 0 && (
                    <p className="text-xs text-berlin-400 mt-2">
                      💡 We take a 20% fee on EUR transactions to keep the platform running
                    </p>
                  )}
                </div>
                
                {/* Summary */}
                <div className="p-4 bg-berlin-50 rounded-xl">
                  <h4 className="font-medium text-berlin-900 mb-2">Summary</h4>
                  <div className="text-sm text-berlin-600 space-y-1">
                    <p><strong>Glove:</strong> {color} {brand && `${brand} `}glove ({side} hand, size {size.toUpperCase()})</p>
                    <p><strong>Location:</strong> {postalCode} {foundLocation && `- ${foundLocation}`}</p>
                    <p><strong>Found:</strong> {foundDate}</p>
                    {feeAmount > 0 && (
                      <p><strong>Finder's fee:</strong> {feeAmount} {feeCurrency === 'eur' ? '€' : 'Postaal coins'}</p>
                    )}
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 border border-berlin-200 rounded-xl font-medium text-berlin-600 hover:bg-berlin-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !finderEmail}
                    className="flex-1 py-3 bg-glove-500 hover:bg-glove-600 disabled:bg-berlin-200 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Submit Listing
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}



