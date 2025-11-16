/**
 * Type definitions for API responses
 * Matches /api/scan endpoint response schema
 */

export interface BookData {
  isbn: string;
  title: string;
  subtitle?: string | null;
  authors: string[];
  publisher?: string | null;
  published_date?: string | null;
  description?: string | null;
  page_count?: number | null;
  categories?: string[];
  language?: string | null;
  thumbnail_url?: string | null;
  small_thumbnail_url?: string | null;
  average_rating?: number | null;
  ratings_count?: number | null;
  quantity_available?: number;
  scan_count?: number;
  first_scanned_at?: string;
  last_scanned_at?: string;
}

export interface ScanResponse {
  success: boolean;
  scan_id?: string;
  book?: BookData | null;
  warning?: string;
  error?: string;
  code?: string;
  details?: string;
}

export interface ScanResult {
  success: boolean;
  message?: string;
  book?: BookData | null;
}
