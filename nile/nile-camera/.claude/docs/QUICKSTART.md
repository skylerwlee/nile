# Quick Start - Book Scanner App

## Fastest Way to Run

```bash
# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..

# Run on iPhone (connect your iPhone via USB first)
npm run ios
```

## What This App Does

📱 Scans ISBN barcodes on textbooks using your iPhone camera
✅ Prevents duplicate scans with smart debounce logic
📊 Displays book classification (textbook, academic, leisure, other)
💾 Saves books to database via API calls
✍️ Manual entry for damaged barcodes

## Project Structure

```
nile/
├── App.tsx                           # Root component
├── src/
│   ├── components/
│   │   ├── CameraScreen.tsx         # Main camera + scanning logic
│   │   ├── ConfirmationModal.tsx    # Book confirmation dialog
│   │   └── ManualEntryModal.tsx     # Manual ISBN entry
│   ├── services/
│   │   └── api.ts                   # Database API (TODO: add your endpoint)
│   └── types/
│       └── Book.ts                  # TypeScript interfaces
├── ios/
│   ├── Podfile                      # iOS dependencies
│   └── Info.plist                   # Camera permissions
└── package.json                     # Node dependencies
```

## Key Files to Customize

### 1. API Integration → `src/services/api.ts`
Update `API_BASE_URL` and replace placeholder functions:
- `fetchBookInfo(isbn)`
- `saveBookToDatabase(isbn)`
- `checkDuplicateBook(isbn)`

### 2. Scan Settings → `CameraScreen.tsx:34`
```typescript
const DEBOUNCE_DELAY = 3000; // Adjust scan cooldown
```

### 3. Camera Permission → `ios/Info.plist:36`
```xml
<key>NSCameraUsageDescription</key>
<string>Your custom permission message</string>
```

## Features Implemented

✅ Camera with live barcode scanning (react-native-vision-camera)
✅ Real-time ISBN detection (EAN-13, UPC, Code-128, QR, etc.)
✅ Debounce logic (prevents duplicate scans within 3 seconds)
✅ Confirmation modal with book details
✅ Manual ISBN entry with validation
✅ Book classification display with color badges
✅ Scan counter
✅ Camera permission handling
✅ API placeholder functions (ready for your backend)

## Component Overview

### CameraScreen (`src/components/CameraScreen.tsx`)
- **Lines 30-40**: Debounce logic
- **Lines 70-120**: Barcode scanning handler
- **Lines 122-145**: Code scanner configuration
- **Lines 147-180**: Confirm/reject handlers
- **Lines 280-350**: UI styling with scan frame

### ConfirmationModal (`src/components/ConfirmationModal.tsx`)
- Displays: ISBN, Title, Edition, Classification, Quantity
- Color-coded classification badges
- Loading state while fetching book info
- Error handling for missing books

### ManualEntryModal (`src/components/ManualEntryModal.tsx`)
- ISBN validation (10 or 13 digits)
- Format examples
- Keyboard-optimized input

## Testing Checklist

- [ ] Connect physical iPhone via USB
- [ ] Run `npm run ios`
- [ ] Grant camera permission
- [ ] Scan a book barcode
- [ ] Verify book info appears
- [ ] Test "Confirm" button
- [ ] Test "Reject" button
- [ ] Test "Manual Entry" with ISBN: 9780123456789
- [ ] Verify duplicate scan prevention

## Next Steps

1. **Connect Backend**: Update `src/services/api.ts` with real endpoints
2. **Test with Real Data**: Integrate with your database
3. **Customize UI**: Modify colors and styling in component files
4. **Add Features**: See README.md for enhancement ideas

## Need Help?

- Detailed docs: `README.md`
- Setup issues: `SETUP.md`
- Code comments: Check component files for inline documentation

---

Built for hackathon/educational purposes | React Native + TypeScript
