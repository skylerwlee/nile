# Quick Start - Supabase Integration

## 1. Create Supabase Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE scanned_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  isbn TEXT NOT NULL,
  scanner_id TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_scanned_books_isbn ON scanned_books(isbn);
CREATE INDEX idx_scanned_books_scanner_id ON scanned_books(scanner_id);
```

## 2. Enable Public Access (Development)

```sql
ALTER TABLE scanned_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
ON scanned_books FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read"
ON scanned_books FOR SELECT TO anon USING (true);
```

## 3. Configure App

Edit `src/config/supabase.ts`:

```typescript
export const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_ID.supabase.co',
  anonKey: 'YOUR_ANON_KEY_HERE',
};
```

Get these from: Supabase Dashboard → Settings → API

## 4. Run the App

```bash
npm install
cd ios && pod install && cd ..
npm run ios
```

## That's it!

The app will now POST scans to your Supabase database:
- `isbn` - Scanned barcode
- `scanner_id` - Device ID
- `scanned_at` - Timestamp

View scans in: Supabase Dashboard → Table Editor → scanned_books
