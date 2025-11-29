const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GloveAnalysis {
  brand: string | null;
  color: string;
  size: string;
  side: string;
  material: string | null;
  suggested_price_eur: number | null;
  description: string;
  is_valid_glove: boolean;
  moderation_passed: boolean;
  moderation_notes: string | null;
}

export interface GloveListing {
  id: number;
  photo_url: string;
  brand: string | null;
  color: string;
  size: string;
  side: string;
  material: string | null;
  description: string | null;
  postal_code: string;
  found_date: string;
  found_location_description: string | null;
  finder_display_name: string | null;
  fee_amount: number;
  fee_currency: 'postaal' | 'eur';
  status: string;
  confidence_score: number;
  created_at: string;
}

export interface GloveListingDetail extends GloveListing {
  finder_email: string | null;
  contact_unlocked: boolean;
}

export interface SearchResponse {
  items: GloveListing[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaymentInfo {
  listing_id: number;
  fee_amount: number;
  fee_currency: string;
  platform_fee: number;
  total_amount: number;
}

export interface ContactRequest {
  id: number;
  listing_id: number;
  fee_paid: number;
  fee_currency: string;
  platform_fee: number;
  is_paid: boolean;
  message_sent: boolean;
  created_at: string;
}

export interface PostalCodeStats {
  postal_code: string;
  gloves_found: number;
  gloves_claimed: number;
  total_listings: number;
}

// Analyze a glove image
export async function analyzeGloveImage(file: File): Promise<GloveAnalysis> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/gloves/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze image');
  }

  return response.json();
}

// Upload a new glove listing
export async function uploadGlove(formData: FormData): Promise<GloveListing> {
  const response = await fetch(`${API_BASE}/api/gloves/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload glove');
  }

  return response.json();
}

// Search for gloves
export async function searchGloves(params: {
  postal_codes?: string[];
  brand?: string;
  color?: string;
  size?: string;
  side?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.postal_codes?.length) {
    searchParams.set('postal_codes', params.postal_codes.join(','));
  }
  if (params.brand) searchParams.set('brand', params.brand);
  if (params.color) searchParams.set('color', params.color);
  if (params.size) searchParams.set('size', params.size);
  if (params.side) searchParams.set('side', params.side);
  if (params.date_from) searchParams.set('date_from', params.date_from);
  if (params.date_to) searchParams.set('date_to', params.date_to);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.per_page) searchParams.set('per_page', params.per_page.toString());

  const response = await fetch(`${API_BASE}/api/gloves/search?${searchParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to search gloves');
  }

  return response.json();
}

// Get a single glove listing
export async function getGloveListing(id: number, requesterEmail?: string): Promise<GloveListingDetail> {
  const params = requesterEmail ? `?requester_email=${encodeURIComponent(requesterEmail)}` : '';
  const response = await fetch(`${API_BASE}/api/gloves/${id}${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get listing');
  }

  return response.json();
}

// Get payment info for a listing
export async function getPaymentInfo(listingId: number): Promise<PaymentInfo> {
  const response = await fetch(`${API_BASE}/api/gloves/${listingId}/payment-info`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get payment info');
  }

  return response.json();
}

// Contact a finder
export async function contactFinder(listingId: number, data: {
  requester_email: string;
  requester_name?: string;
  message: string;
}): Promise<ContactRequest> {
  const response = await fetch(`${API_BASE}/api/gloves/${listingId}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to contact finder');
  }

  return response.json();
}

// Report a listing
export async function reportListing(listingId: number, data: {
  reason: 'spam' | 'inappropriate' | 'wrong_location' | 'fake' | 'other';
  description?: string;
  reporter_email?: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE}/api/gloves/${listingId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to report listing');
  }
}

// Get postal code stats (leaderboard)
export async function getPostalCodeStats(): Promise<PostalCodeStats[]> {
  const response = await fetch(`${API_BASE}/api/gloves/stats/postal-codes`);

  if (!response.ok) {
    return [];
  }

  return response.json();
}



