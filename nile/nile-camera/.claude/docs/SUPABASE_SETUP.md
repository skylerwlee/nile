# Supabase Integration Setup Guide

This guide walks you through setting up Supabase for the ISBN Scanner app.

## Overview

The app has been simplified to:
- Scan ISBN barcodes
- POST `{isbn, scanner_id, scanned_at}` to Supabase
- Show success/error confirmation
- Continue scanning (duplicates allowed)

All book processing, classification, and duplicate handling is done server-side (outside this app).

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project name**: `nile-scanner` (or your choice)
   - **Database password**: Create a strong password
   - **Region**: Choose closest to your location
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Create Database Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click **New Table**
3. Configure the table:

```sql
-- Table name: scanned_books
-- Columns:
id          | uuid      | Primary Key | Default: uuid_generate_v4()
isbn        | text      | Required    |
scanner_id  | text      | Required    |
scanned_at  | timestamp | Required    | Default: now()
created_at  | timestamp | Required    | Default: now()
```

Or use this SQL (go to **SQL Editor** > **New Query**):

```sql
CREATE TABLE scanned_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  isbn TEXT NOT NULL,
  scanner_id TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_scanned_books_isbn ON scanned_books(isbn);
CREATE INDEX idx_scanned_books_scanner_id ON scanned_books(scanner_id);
CREATE INDEX idx_scanned_books_scanned_at ON scanned_books(scanned_at);
```

## Step 3: Configure Row Level Security (RLS)

By default, Supabase enables RLS. You need to create policies to allow the app to insert data.

### Option A: Simple Public Insert (Development/Hackathon)

If you're in a hackathon or development environment:

```sql
-- Enable RLS
ALTER TABLE scanned_books ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (using anon key)
CREATE POLICY "Allow public insert"
ON scanned_books
FOR INSERT
TO anon
WITH CHECK (true);

-- Optional: Allow reading your own scans
CREATE POLICY "Allow read own scans"
ON scanned_books
FOR SELECT
TO anon
USING (true);
```

### Option B: API Key Authentication (Production)

For production, use API key authentication in headers:

```sql
-- Enable RLS
ALTER TABLE scanned_books ENABLE ROW LEVEL SECURITY;

-- Allow inserts with valid API key (implement server-side)
CREATE POLICY "Allow authenticated insert"
ON scanned_books
FOR INSERT
TO authenticated
WITH CHECK (true);
```

## Step 4: Get API Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...` (long string)
3. Copy both values

## Step 5: Configure the App

1. Open `src/config/supabase.ts`
2. Replace the placeholder values:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co',  // Replace with your URL
  anonKey: 'eyJhbGc...',  // Replace with your anon key
};
```

**Alternative: Using Environment Variables**

Create a `.env` file in the project root:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Test the Integration

### 6.1 Build and Run the App

```bash
# Install dependencies (if not already done)
npm install

# iOS - Install pods
cd ios && pod install && cd ..

# Run on iOS device (simulator won't work - needs camera)
npm run ios
```

### 6.2 Test Scanning

1. Launch app on physical device
2. Grant camera permissions
3. Scan an ISBN barcode
4. You should see:
   - Loading spinner ("Saving scan...")
   - Success modal with green checkmark
   - ISBN displayed
   - "Continue Scanning" button

### 6.3 Verify in Supabase

1. Go to Supabase dashboard
2. Navigate to **Table Editor** > `scanned_books`
3. You should see your scan:
   - `isbn`: The barcode you scanned
   - `scanner_id`: Your device's unique ID
   - `scanned_at`: Timestamp of the scan

## Database Schema

```typescript
{
  id: string;           // UUID primary key
  isbn: string;         // Scanned ISBN barcode
  scanner_id: string;   // Device ID (iOS IDFV)
  scanned_at: string;   // ISO timestamp when scanned
  created_at: string;   // Row creation timestamp
}
```

## App Architecture

### Simple Flow

```
1. Scan barcode with camera
   ↓
2. Get device ID (scanner_id)
   ↓
3. POST to Supabase: {isbn, scanner_id, scanned_at}
   ↓
4. Show success/error modal
   ↓
5. Return to camera (allow re-scanning)
```

### Key Files

- **`src/config/supabase.ts`** - Supabase credentials
- **`src/services/api.ts`** - `postScanToSupabase()` function
- **`src/components/CameraScreen.tsx`** - Camera and scanning logic
- **`src/components/ConfirmationModal.tsx`** - Success/error display
- **`src/types/Book.ts`** - TypeScript types

## Features

✅ **Simple POST-only design** - No fetching, no classification
✅ **Device tracking** - Uses iOS IDFV as scanner_id
✅ **Duplicate scans allowed** - Backend handles deduplication
✅ **Debounce** - 2-second cooldown between scans
✅ **Manual entry** - For damaged barcodes
✅ **Session count** - Tracks scans in current session

## Troubleshooting

### App shows "Failed to save scan"

**Check:**
1. Supabase URL and anon key are correct in `src/config/supabase.ts`
2. Table `scanned_books` exists
3. RLS policies allow inserts (see Step 3)
4. Internet connection is working

**Debug:**
- Check React Native logs: `npx react-native log-ios`
- Check Supabase logs: Dashboard > **Logs** > **Postgres Logs**

### "Error: relation 'scanned_books' does not exist"

**Solution:** Create the table (see Step 2)

### "Row level security policy violation"

**Solution:** Add RLS policies (see Step 3)

### Device ID not working

**Fallback:** App generates timestamp-based ID if device ID fails

### Pods installation fails

**Try:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## Next Steps

Your backend/server can now:
- Query `scanned_books` table
- Fetch book details from ISBN API (Google Books, Open Library)
- Classify books (textbook, academic, etc.)
- Handle duplicates
- Generate reports
- Export data

The app is now a simple data collector - all intelligence is server-side!

## Security Notes

⚠️ **Development Setup**: Using anon key with public insert policy
✅ **Production**: Implement proper authentication and RLS policies
✅ **API Key**: Never commit `.env` to git (already in `.gitignore`)

## Support

- Supabase Docs: https://supabase.com/docs
- React Native Vision Camera: https://react-native-vision-camera.com
- Device Info: https://github.com/react-native-device-info/react-native-device-info
