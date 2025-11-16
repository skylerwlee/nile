# Book Scanner App - ISBN Barcode Scanner for iPhone

A React Native application for scanning ISBN barcodes on textbooks using the device camera. Built for iOS with real-time barcode detection, duplicate prevention, and database integration.

## Features

- **Real-time Barcode Scanning**: Uses `react-native-vision-camera` for live camera feed and barcode detection
- **ISBN Detection**: Automatically detects and processes ISBN barcodes (EAN-13, UPC, and other formats)
- **Duplicate Prevention**: Implements debounce logic to prevent scanning the same book multiple times
- **Confirmation Modal**: Displays book information (title, edition, classification) before saving
- **Manual Entry**: Allows manual ISBN input for damaged or unreadable barcodes
- **Book Classification**: Displays book type (textbook, academic, leisure, or other)
- **Scan History**: Tracks the number of books scanned in the current session

## Architecture

### Components

1. **CameraScreen** (`src/components/CameraScreen.tsx`)
   - Main camera interface
   - Handles barcode scanning with debounce logic
   - Manages camera permissions
   - Coordinates between scanning and confirmation flow

2. **ConfirmationModal** (`src/components/ConfirmationModal.tsx`)
   - Displays scanned book information
   - Shows book classification with color-coded badges
   - Provides confirm/reject actions

3. **ManualEntryModal** (`src/components/ManualEntryModal.tsx`)
   - Manual ISBN input interface
   - Validates ISBN format (10 or 13 digits)
   - Handles damaged/unreadable barcodes

### Services

- **API Service** (`src/services/api.ts`)
  - `fetchBookInfo(isbn)`: Retrieves book information from database
  - `saveBookToDatabase(isbn)`: Saves/updates book in database
  - `checkDuplicateBook(isbn)`: Checks for existing books
  - Currently includes placeholder mock implementations

### Types

- **Book Types** (`src/types/Book.ts`)
  - Book interface with ISBN, title, edition, classification
  - BookClassification type definition
  - ScanResult interface

## UI Flow

```
Camera Screen
    ↓
Scan ISBN Barcode
    ↓
Fetch Book Info (API call)
    ↓
Confirmation Modal
    ↓ (Confirm)
Save to Database (API call)
    ↓
Return to Camera Screen
```

## Prerequisites

- Node.js >= 18
- React Native development environment
- Xcode (for iOS development)
- CocoaPods
- Physical iOS device (camera required for testing)

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd nile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run on iOS**
   ```bash
   npm run ios
   ```

   Or open in Xcode:
   ```bash
   open ios/BookScannerApp.xcworkspace
   ```

## Camera Permissions

The app automatically requests camera permissions on first launch. The permission message is configured in `ios/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to scan ISBN barcodes on textbooks.</string>
```

## Dependencies

### Core Dependencies
- **react-native-vision-camera**: Camera feed and barcode scanning
- **vision-camera-code-scanner**: Barcode detection plugin
- **react-native-modal**: Modal dialogs
- **react-native-reanimated**: Animations (optional)

### API Integration

The app includes placeholder API functions in `src/services/api.ts`. To integrate with your backend:

1. Update `API_BASE_URL` with your actual API endpoint
2. Replace mock implementations in:
   - `fetchBookInfo(isbn)`
   - `saveBookToDatabase(isbn)`
   - `checkDuplicateBook(isbn)`

Example API integration:

```typescript
export const fetchBookInfo = async (isbn: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${isbn}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book info:', error);
    return null;
  }
};
```

## Configuration

### Barcode Types

The scanner supports multiple barcode formats configured in `CameraScreen.tsx`:
- EAN-13 (ISBN)
- EAN-8
- UPC-A, UPC-E
- Code-128, Code-39, Code-93
- Codabar, ITF
- QR codes

### Debounce Settings

Prevent duplicate scans by adjusting the debounce delay in `CameraScreen.tsx`:

```typescript
const DEBOUNCE_DELAY = 3000; // 3 seconds between same ISBN scans
```

## Usage

1. **Launch the app** - Camera screen opens automatically
2. **Grant camera permission** - Required on first launch
3. **Align barcode** - Position ISBN barcode within the scanning frame
4. **Auto-scan** - App automatically detects and processes barcodes
5. **Review book info** - Confirmation modal shows book details
6. **Confirm or reject** - Save to database or return to scanning
7. **Manual entry** - Tap "Manual Entry" button for damaged barcodes

## Testing Notes

- Use a physical iOS device (camera required)
- Simulator does not support camera functionality
- Test with various ISBN formats (10-digit and 13-digit)
- Verify debounce logic prevents duplicate scans
- Test manual entry validation

## Project Structure

```
nile/
├── src/
│   ├── components/
│   │   ├── CameraScreen.tsx       # Main camera component
│   │   ├── ConfirmationModal.tsx  # Book confirmation dialog
│   │   └── ManualEntryModal.tsx   # Manual ISBN input
│   ├── services/
│   │   └── api.ts                 # API service (placeholder)
│   └── types/
│       └── Book.ts                # TypeScript type definitions
├── ios/
│   ├── Podfile                    # CocoaPods dependencies
│   └── Info.plist                 # iOS app configuration
├── App.tsx                        # Root component
├── package.json                   # Node dependencies
├── tsconfig.json                  # TypeScript configuration
└── babel.config.js                # Babel configuration
```

## Troubleshooting

### Camera not working
- Ensure you're testing on a physical device
- Check camera permissions in iOS Settings
- Verify `NSCameraUsageDescription` in Info.plist

### Barcode not detected
- Ensure good lighting conditions
- Try different angles and distances
- Verify barcode is in EAN-13 or UPC format
- Use manual entry as fallback

### Build errors
- Clean build: `cd ios && rm -rf build && cd ..`
- Reinstall pods: `cd ios && pod install && cd ..`
- Clear Metro cache: `npm start -- --reset-cache`

## Future Enhancements

- [ ] Add database sync status indicator
- [ ] Implement offline mode with local storage
- [ ] Add batch scanning with queue
- [ ] Include book cover image display
- [ ] Add export functionality for scan history
- [ ] Integrate with Supabase or Firebase
- [ ] Add sound/haptic feedback on successful scan
- [ ] Implement flashlight toggle for low-light scanning

## License

This project is built for hackathon/educational purposes.

## Support

For issues or questions, refer to the component documentation and inline code comments.
