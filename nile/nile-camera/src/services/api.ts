/**
 * API Service for Next.js Backend
 * Posts scanned ISBN to /api/scan endpoint which handles:
 * - ISBN validation
 * - Google Books metadata fetching
 * - Database sync (scanned_books + books tables)
 */

import DeviceInfo from 'react-native-device-info';
import { API_CONFIG } from '../config/supabase';
import { ScanResult, ScanResponse } from '../types/Book';

/**
 * Get the device's unique identifier (iOS IDFV)
 * This will be used as the scanner_id
 */
export const getScannerId = async (): Promise<string> => {
  try {
    // Use iOS Identifier for Vendor (IDFV)
    const deviceId = await DeviceInfo.getUniqueId();
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback to a random ID if we can't get the device ID
    return `scanner-${Date.now()}`;
  }
};

/**
 * Posts a scanned ISBN to the Next.js API endpoint
 * This ensures proper sync between scanned_books and books tables,
 * and fetches metadata from Google Books API
 *
 * @param isbn - The scanned ISBN barcode
 * @returns Promise with success status and book data
 */
export const postScanToAPI = async (isbn: string): Promise<ScanResult> => {
  try {
    // Get scanner ID (device ID)
    const scannerId = await getScannerId();

    // Prepare request body
    const requestBody = {
      isbn: isbn,
      scanner_id: scannerId,
    };

    console.log('Posting scan to API:', { isbn, scanner_id: scannerId });

    // Get full API URL
    const apiUrl = API_CONFIG.getUrl(API_CONFIG.endpoints.scan);
    console.log('API URL:', apiUrl);

    // Make API call to Next.js backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Parse response
    const data: ScanResponse = await response.json();

    // Check response status
    if (!response.ok) {
      console.error('API error:', data);

      // Return user-friendly error messages
      if (data.code === 'INVALID_ISBN') {
        return {
          success: false,
          message: 'This barcode is not a valid ISBN. Please scan a book\'s ISBN barcode.',
        };
      } else if (data.code === 'MISSING_ISBN') {
        return {
          success: false,
          message: 'ISBN is required',
        };
      } else {
        return {
          success: false,
          message: data.error || `Server error: ${response.statusText}`,
        };
      }
    }

    // Handle success response
    if (data.success) {
      console.log('Scan saved successfully:', data);

      // Check for warnings (scan recorded but book fetch failed)
      if (data.warning) {
        return {
          success: true,
          message: data.warning,
          book: null,
        };
      }

      // Return success with book data
      return {
        success: true,
        message: 'Scan saved successfully!',
        book: data.book || null,
      };
    }

    // Fallback error
    return {
      success: false,
      message: data.error || 'Unknown error occurred',
    };
  } catch (error) {
    console.error('Error posting to API:', error);

    // Network error handling
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      return {
        success: false,
        message: 'Network error. Please check your internet connection and try again.',
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// Export as the main scan function
export const postScanToSupabase = postScanToAPI;
