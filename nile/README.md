# Nile - Textbook Inventory Management System

A complete platform for managing textbook inventory through ISBN scanning, featuring a React Native mobile scanner app and a Next.js web application with admin and professor portals.

## Project Overview

**Nile** consists of two main components:

1. **nile-camera**: iOS scanner app for scanning ISBN barcodes
2. **nile-webapp-main**: Next.js web application with admin dashboard, professor request system, and REST API

## Architecture

```
┌─────────────────────┐
│   Scanner App (iOS) │
│  nile-camera        │
└──────────┬──────────┘
           │
           │ POST /api/scan
           │
           ▼
┌─────────────────────┐
│   Web Application   │
│  nile-webapp-main   │
│                     │
│  ┌───────────────┐  │
│  │   REST API    │  │
│  │  /api/scan    │  │
│  └───────┬───────┘  │
│          │          │
│          ▼          │
│  ┌───────────────┐  │
│  │   Supabase    │  │
│  │   Database    │  │
│  └───────────────┘  │
└─────────────────────┘
```

## Components

### 1. nile-camera - ISBN Scanner App

A React Native iOS application for scanning ISBN barcodes on textbooks using the device camera.

**Features:**
- Real-time barcode scanning with `react-native-vision-camera`
- ISBN detection (EAN-13, UPC, and other formats)
- Duplicate prevention with debounce logic
- Book classification (textbook vs other)
- Manual ISBN entry for damaged barcodes
- Scan history tracking
- REST API integration with web backend

**Tech Stack:**
- React Native 0.76.5
- TypeScript
- react-native-vision-camera
- Supabase (via REST API)

**Quick Start:**
```bash
cd nile-camera
npm install
cd ios && pod install && cd ..
npm run ios
```

See [nile-camera/README.md](./nile-camera/README.md) for detailed documentation.

### 2. nile-webapp-main - Web Application

A Next.js web application providing admin dashboard, professor request system, and REST API for the scanner app.

**Features:**
- `/api/scan` endpoint for ISBN scanning with validation
- Google Books API integration for metadata
- Admin dashboard for inventory management
- Professor portal for textbook requests
- Supabase authentication and database
- Real-time book availability tracking

**Tech Stack:**
- Next.js 15.1
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase
- Google Books API

**Quick Start:**
```bash
cd nile-webapp-main
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## API Specification

### POST /api/scan

Records a book scan and automatically fetches metadata from Google Books API.

**Request:**
```json
{
  "isbn": "9780134670942",
  "scanner_id": "device-uuid-here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "scan_id": "uuid",
  "book": {
    "isbn": "9780134670942",
    "title": "Computer Networks",
    "authors": ["Andrew S. Tanenbaum"],
    "publisher": "Pearson",
    "published_date": "2021",
    "scan_count": 5,
    "last_scanned_at": "2025-11-16T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid ISBN format",
  "code": "INVALID_ISBN"
}
```

See [Scanner App API Specification](./.claude/docs/scanner-app-api-spec.md) for complete API documentation.

## Database Schema

### Core Tables

- **books**: Book metadata from Google Books API
  - isbn (PK)
  - title, authors, publisher, etc.
  - scan_count, first_scanned_at, last_scanned_at

- **scanned_books**: Individual scan records
  - id (PK)
  - isbn (FK → books)
  - scanner_id, scanned_at

- **book_requests**: Professor textbook requests
  - id (PK)
  - isbn, quantity, status
  - professor_id, course, semester

## Getting Started

### Prerequisites

- Node.js >= 18
- iOS development environment (Xcode, CocoaPods)
- Supabase account
- Google Books API key (optional, for enhanced metadata)

### Environment Setup

#### nile-camera/.env
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
API_BASE_URL=http://localhost:3000  # or your deployed URL
```

#### nile-webapp-main/.env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skylerwlee/nile.git
   cd nile
   ```

2. **Set up the web application**
   ```bash
   cd nile-webapp-main
   npm install
   npm run dev
   ```

3. **Set up the scanner app**
   ```bash
   cd nile-camera
   npm install
   cd ios && pod install && cd ..
   npm run ios
   ```

## Deployment

### Web Application (Vercel)

The web app is deployed on Vercel:

```bash
cd nile-webapp-main
vercel deploy
```

Configure environment variables in the Vercel dashboard.

### Scanner App (iOS)

Build and deploy to TestFlight:

1. Open `nile-camera/ios/BookScannerApp.xcworkspace` in Xcode
2. Configure signing & capabilities
3. Archive and upload to App Store Connect
4. Distribute via TestFlight

## Project Structure

```
nile/
├── nile-camera/              # React Native iOS scanner app
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API services
│   │   └── types/           # TypeScript types
│   ├── ios/                 # iOS native code
│   └── package.json
│
├── nile-webapp-main/        # Next.js web application
│   ├── app/                 # Next.js app router
│   │   ├── api/            # REST API routes
│   │   ├── admin/          # Admin dashboard
│   │   └── professor/      # Professor portal
│   ├── components/         # React components
│   ├── lib/               # Utilities & services
│   └── package.json
│
└── README.md              # This file
```

## Development Workflow

1. **Start the web app** (runs on port 3000)
2. **Update API_BASE_URL** in scanner app to point to local or deployed URL
3. **Run the scanner app** on a physical iOS device
4. **Scan barcodes** - they will be sent to the web API
5. **View results** in admin dashboard

## Troubleshooting

### Scanner App
- **Camera not working**: Ensure physical device, check permissions
- **Barcode not detected**: Good lighting, proper angle, use manual entry
- **API errors**: Check API_BASE_URL in .env, verify backend is running

### Web App
- **Database errors**: Check Supabase credentials in .env.local
- **API failures**: Verify Google Books API key is valid
- **Build errors**: Clear `.next` folder and rebuild

## Future Enhancements

- [ ] Android scanner app
- [ ] Batch scanning with queue
- [ ] Offline mode with sync
- [ ] Book cover images in scanner app
- [ ] Export scan history
- [ ] Student portal for textbook search
- [ ] Analytics dashboard
- [ ] Push notifications for request updates

## License

This project is built for educational purposes.

## Support

For issues or questions:
- Scanner app: See [nile-camera/README.md](./nile-camera/README.md)
- Web app: See component documentation in `nile-webapp-main/`
- API: See [Scanner App API Specification](./.claude/docs/scanner-app-api-spec.md)
