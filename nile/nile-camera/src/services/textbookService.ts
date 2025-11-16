/**
 * Textbook ISBN Service
 * Manages loading and checking ISBNs against the textbook database
 *
 * Note: For React Native, we're using a hardcoded list approach for simplicity.
 * To update the ISBN list, edit the TEXTBOOK_ISBNS array below or replace
 * this with a dynamic loading mechanism.
 */

// Import the ISBN data
// You can replace this file or update it with your own ISBNs
import textbookISBNData from '../../assets/textbook-isbns.json';

/**
 * Set of textbook ISBNs for O(1) lookup
 */
let textbookISBNs: Set<string> = new Set();
let isLoaded = false;

/**
 * Loads textbook ISBNs from the JSON file
 */
export const loadTextbookISBNs = async (): Promise<void> => {
  if (isLoaded) {
    return; // Already loaded
  }

  try {
    // Convert array to Set for O(1) lookup
    const isbns = textbookISBNData.isbns || [];
    textbookISBNs = new Set(isbns.map(isbn => isbn.trim()));
    isLoaded = true;

    console.log(`Loaded ${textbookISBNs.size} textbook ISBNs`);
  } catch (error) {
    console.error('Error loading textbook ISBNs:', error);
    // If loading fails, continue with empty set
    textbookISBNs = new Set();
    isLoaded = true;
  }
};

/**
 * Checks if an ISBN is in the textbook database
 * @param isbn - The ISBN to check
 * @returns true if the ISBN is a textbook, false otherwise
 */
export const isTextbook = (isbn: string): boolean => {
  if (!isLoaded) {
    console.warn('Textbook ISBNs not loaded yet');
    return false;
  }

  // Normalize ISBN (remove hyphens and spaces)
  const normalizedISBN = isbn.replace(/[-\s]/g, '');
  return textbookISBNs.has(normalizedISBN);
};

/**
 * Gets the book type label for display
 * @param isbn - The ISBN to check
 * @returns "textbook" or "other"
 */
export const getBookType = (isbn: string): 'textbook' | 'other' => {
  return isTextbook(isbn) ? 'textbook' : 'other';
};

/**
 * Gets the total number of loaded textbook ISBNs
 */
export const getTextbookCount = (): number => {
  return textbookISBNs.size;
};
