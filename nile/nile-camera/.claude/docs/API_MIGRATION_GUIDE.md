# API Migration Guide: Supabase Direct → Next.js API

## Overview

The scanner app has been updated to use the Next.js `/api/scan` endpoint instead of posting directly to Supabase. This ensures proper data synchronization between the `scanned_books` and `books` tables, and automatically fetches book metadata from Google Books API.

## What Changed

### Before (Direct Supabase Access) ❌

```typescript
// Posted directly to Supabase REST API
POST https://[project].supabase.co/rest/v1/scanned_books

// Problems:
// - Only scanned_books table was populated
// - books table was never updated
// - No Google Books metadata fetching
// - Professors couldn't request books that weren't in books table
```

### After (Next.js API Endpoint) ✅

```typescript
// Posts to Next.js API which handles everything
POST https://nile-webapp.vercel.app/api/scan

// Benefits:
// - Both scanned_books and books tables are populated
// - Google Books metadata automatically fetched
// - ISBN validation and normalization
// - Better error handling
// - Book availability tracking
```

## Files Modified

### 1. `src/types/Book.ts`
**Added new types** to match API response:
- `BookData` - Complete book metadata from API
- `ScanResponse` - Full API response structure
- Updated `ScanResult` to include book data

### 2. `src/config/supabase.ts`
**Added API configuration**:
- `API_CONFIG` object with baseUrl and endpoints
- `getUrl()` helper function
- Environment variable support for API_URL

### 3. `src/types/env.d.ts`
**Added new environment variable**:
- `API_URL` type definition

### 4. `src/services/api.ts`
**Complete rewrite**:
- Changed from Supabase REST API to Next.js API
- Added better error handling with specific error codes
- Returns book metadata in response
- Network error detection

### 5. `src/components/ConfirmationModal.tsx`
**Enhanced to display book metadata**:
- Shows book title, subtitle, authors
- Displays publisher and published date
- Shows quantity available
- Responsive ScrollView for long content

### 6. `src/components/CameraScreen.tsx`
**Updated to handle book data**:
- Added `scannedBook` state
- Passes book data to ConfirmationModal
- Clears book data on modal close

### 7. `.env` and `.env.example`
**Added API URL configuration**:
- `API_URL` variable for webapp endpoint
- Comments for development vs production

## Environment Setup

### Production Configuration

```env
# .env file
API_URL=https://nile-webapp.vercel.app
```

### Development Configuration

```env
# .env file (for local testing)
API_URL=http://localhost:3000
```

## API Request/Response

### Request Format

```json
POST /api/scan
Content-Type: application/json

{
  "isbn": "9781234567890",
  "scanner_id": "device-uuid-here"
}
```

### Success Response

```json
{
  "success": true,
  "scan_id": "uuid",
  "book": {
    "isbn": "9781234567890",
    "title": "Introduction to Algorithms",
    "subtitle": "Third Edition",
    "authors": ["Thomas H. Cormen", "Charles E. Leiserson"],
    "publisher": "MIT Press",
    "published_date": "2009",
    "quantity_available": 5,
    "scan_count": 12,
    "thumbnail_url": "https://...",
    ...
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "This barcode is not a valid ISBN",
  "code": "INVALID_ISBN"
}
```

## Error Handling

The app now handles specific error codes:

| Error Code | User Message | Meaning |
|------------|--------------|---------|
| `INVALID_ISBN` | "This barcode is not a valid ISBN. Please scan a book's ISBN barcode." | Scanned barcode is not an ISBN (could be UPC, QR, etc.) |
| `MISSING_ISBN` | "ISBN is required" | Request missing ISBN field |
| Network Error | "Network error. Please check your internet connection and try again." | No internet connection |
| Other | Server error message | Any other API error |

## Testing Checklist

- [ ] **Valid ISBN scan** - Should show book metadata
- [ ] **Invalid ISBN** - Should show error message
- [ ] **UPC barcode** - Should reject with clear error
- [ ] **No internet** - Should show network error
- [ ] **New book** - Should fetch from Google Books
- [ ] **Existing book** - Should update scan count
- [ ] **API unavailable** - Should handle gracefully

## Troubleshooting

### "Network error" on every scan

**Problem**: API URL not configured or incorrect

**Solution**:
1. Check `.env` file has `API_URL=https://nile-webapp.vercel.app`
2. Restart Metro bundler: `npm start -- --reset-cache`
3. Rebuild app

### "Failed to save scan" error

**Possible causes**:
1. API endpoint `/api/scan` not deployed
2. API URL in `.env` is incorrect
3. Firewall blocking requests
4. CORS issue (shouldn't happen with React Native)

**Debug steps**:
1. Check console logs for actual error
2. Verify API URL: `console.log(API_CONFIG.baseUrl)`
3. Test API manually: `curl -X POST https://nile-webapp.vercel.app/api/scan -H "Content-Type: application/json" -d '{"isbn":"9781234567890"}'`

### Book metadata not showing

**Problem**: API returns success but no book data

**Causes**:
1. Google Books API couldn't find the book
2. API returned warning instead of book data

**Expected behavior**: Should still show success with warning message

## Migration Impact

### Data Consistency ✅
- Before: 161 scans but only 2 books in database
- After: Every scan creates/updates a book record

### User Experience ✅
- Before: Only saw ISBN after scan
- After: Sees complete book information (title, authors, etc.)

### Professor Requests ✅
- Before: Couldn't request books that weren't in `books` table
- After: All scanned books are available for requests

### Statistics ✅
- Before: No scan count tracking
- After: `scan_count` and `last_scanned_at` automatically updated

## Next Steps

1. **Deploy webapp** with `/api/scan` endpoint
2. **Test integration** end-to-end
3. **Run backfill script** to add missing books from old scans
4. **Monitor logs** for any API errors
5. **Train users** on new success feedback

## Rollback Plan

If needed, you can temporarily revert to direct Supabase access:

```typescript
// In src/config/supabase.ts
export const API_CONFIG = {
  baseUrl: SUPABASE_CONFIG.url, // Use Supabase URL
  endpoints: {
    scan: `/rest/v1/${SCANNED_BOOKS_TABLE}`, // Use Supabase REST endpoint
  },
  getUrl: (endpoint: string) => `${API_CONFIG.baseUrl}${endpoint}`,
};
```

Then update `src/services/api.ts` to use Supabase headers again.

**Note**: This defeats the purpose of the migration and should only be a temporary emergency measure.

## Support

For issues or questions:
1. Check console logs in the app
2. Review API response in Network tab
3. Test API endpoint manually with curl
4. Check Supabase logs for database errors
5. Review Next.js API route logs

---

**Migration completed**: 2025-01-16
**Next.js API Spec**: See `scanner-app-api-spec.md`
**Data Flow Architecture**: See `data-flow-architecture.md`
