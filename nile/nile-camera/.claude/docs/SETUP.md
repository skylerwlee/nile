# Quick Setup Guide

Follow these steps to get the Book Scanner app running on your iPhone.

## Prerequisites Check

Before starting, ensure you have:
- ✅ macOS computer
- ✅ Xcode installed (from Mac App Store)
- ✅ Node.js 18 or higher (`node --version`)
- ✅ CocoaPods installed (`pod --version`)
- ✅ Physical iPhone with USB cable (camera required)

### Install Missing Prerequisites

**Install Node.js:**
```bash
# Using Homebrew
brew install node
```

**Install CocoaPods:**
```bash
sudo gem install cocoapods
```

**Install Xcode Command Line Tools:**
```bash
xcode-select --install
```

## Step-by-Step Setup

### 1. Install Node Modules
```bash
npm install
```

### 2. Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### 3. Connect Your iPhone
- Connect your iPhone to your Mac via USB cable
- Unlock your iPhone
- Trust your computer if prompted
- Keep your iPhone unlocked during the build process

### 4. Run the App

**Option A: Using React Native CLI (Recommended)**
```bash
npm run ios
```

**Option B: Using Xcode**
```bash
# Open the workspace in Xcode
open ios/BookScannerApp.xcworkspace

# Then:
# 1. Select your iPhone from the device dropdown
# 2. Click the Play button (▶) or press Cmd+R
```

### 5. Grant Camera Permission
- When the app launches, it will request camera permission
- Tap "Allow" to enable barcode scanning

## Common Issues

### "Command not found: pod"
```bash
sudo gem install cocoapods
```

### "Unable to boot simulator"
You need a physical iPhone device for this app (camera required).

### "Code signing error"
In Xcode:
1. Select the project in the navigator
2. Select the target "BookScannerApp"
3. Go to "Signing & Capabilities"
4. Select your Apple ID under "Team"
5. Enable "Automatically manage signing"

### "Metro bundler error"
```bash
# Clear Metro cache
npm start -- --reset-cache

# In a new terminal
npm run ios
```

### Build errors after installing dependencies
```bash
# Clean everything and rebuild
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
npm start -- --reset-cache
```

## Development Workflow

### Start Metro Bundler
```bash
npm start
```

### Run on iOS (with Metro running)
```bash
npm run ios
```

### Clear Cache (if you encounter issues)
```bash
npm start -- --reset-cache
```

### View Logs
```bash
# React Native logs
npx react-native log-ios

# Or use Xcode console (Cmd+Shift+Y)
```

## Testing the App

1. **Launch app** - Should open to camera screen
2. **Camera permission** - Grant access when prompted
3. **Test scanning** - Point at any ISBN barcode
4. **Test manual entry**:
   - Tap "Manual Entry" button
   - Enter: `9780123456789`
   - Tap "Submit"
5. **Verify confirmation modal** - Should show book details
6. **Test confirm/reject** - Should return to camera

## Next Steps

### Connect to Your Backend API

Edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-api.com/api';

export const fetchBookInfo = async (isbn: string): Promise<Book | null> => {
  const response = await fetch(`${API_BASE_URL}/books/${isbn}`);
  return await response.json();
};
```

### Customize UI

- **Colors**: Modify styles in component files
- **Scan frame**: Adjust in `CameraScreen.tsx:line_280`
- **Debounce delay**: Change `DEBOUNCE_DELAY` in `CameraScreen.tsx:line_34`

### Add Features

See `README.md` for architecture details and extension ideas.

## Need Help?

- Check the main `README.md` for detailed documentation
- Read inline code comments in component files
- Review React Native Vision Camera docs: https://react-native-vision-camera.com/

## Build for Production

When ready to distribute:

1. Open Xcode workspace
2. Select "Any iOS Device (arm64)" as target
3. Product → Archive
4. Follow Xcode's distribution wizard
5. Upload to App Store Connect or distribute ad-hoc

---

Happy scanning! 📱📚
