/**
 * Camera Screen Component
 * Main camera interface for scanning ISBN barcodes
 * Integrates react-native-vision-camera with barcode scanning capability
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { postScanToSupabase } from '../services/api';
import { BookData } from '../types/Book';
import { loadTextbookISBNs, getBookType } from '../services/textbookService';
import ConfirmationModal from './ConfirmationModal';
import ManualEntryModal from './ManualEntryModal';

const { width, height } = Dimensions.get('window');

const CameraScreen: React.FC = () => {
  // Camera permissions state
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  // Component state
  const [isActive, setIsActive] = useState(true);
  const [scannedISBN, setScannedISBN] = useState<string | null>(null);
  const [bookType, setBookType] = useState<'textbook' | 'other'>('other');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanMessage, setScanMessage] = useState<string>('');
  const [scannedBook, setScannedBook] = useState<BookData | null>(null);
  const [scanCount, setScanCount] = useState(0);

  // Debounce mechanism to prevent rapid re-scans
  // Using ref for immediate synchronous access (not delayed by state updates)
  const lastScannedISBN = useRef<string>('');
  const isProcessing = useRef<boolean>(false);
  const scanDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_DELAY = 2000; // 2 seconds between scans

  /**
   * Request camera permission on mount
   */
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  /**
   * Load textbook ISBNs on mount
   */
  useEffect(() => {
    loadTextbookISBNs().catch(error => {
      console.error('Failed to load textbook ISBNs:', error);
    });
  }, []);

  /**
   * Processes scanned ISBN barcode
   * Posts to Supabase immediately - no fetching, no duplicate checking
   */
  const processScannedISBN = useCallback(
    async (isbn: string) => {
      // Prevent processing if already processing or duplicate scan
      if (isProcessing.current || isbn === lastScannedISBN.current) {
        console.log(`Debouncing scan for ISBN: ${isbn} (processing: ${isProcessing.current})`);
        return;
      }

      console.log(`Processing scanned ISBN: ${isbn}`);

      // Set processing flag and update last scanned ISBN immediately (synchronous)
      isProcessing.current = true;
      lastScannedISBN.current = isbn;

      // Set debounce timer to reset lastScannedISBN
      if (scanDebounceTimer.current) {
        clearTimeout(scanDebounceTimer.current);
      }
      scanDebounceTimer.current = setTimeout(() => {
        lastScannedISBN.current = '';
      }, DEBOUNCE_DELAY);

      // Check if ISBN is a textbook
      const type = getBookType(isbn);

      // Deactivate camera while processing
      setIsActive(false);
      setIsLoading(true);
      setScannedISBN(isbn);
      setBookType(type);
      setShowConfirmModal(true);

      try {
        // Post scan to API
        const result = await postScanToSupabase(isbn);

        setScanSuccess(result.success);
        setScanMessage(result.message || '');
        setScannedBook(result.book || null);

        if (result.success) {
          // Increment scan count
          setScanCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error posting scan:', error);
        setScanSuccess(false);
        setScanMessage('Failed to save scan.');
        setScannedBook(null);
      } finally {
        setIsLoading(false);
        // Reset processing flag to allow next scan
        isProcessing.current = false;
      }
    },
    [], // No dependencies needed since we use refs
  );

  /**
   * Code scanner configuration
   * Detects various barcode formats including EAN-13 (ISBN)
   */
  const codeScanner = useCodeScanner({
    codeTypes: [
      'ean-13',      // ISBN-13 barcodes
      'ean-8',       // ISBN-8 barcodes
      'upc-a',       // UPC-A barcodes
      'upc-e',       // UPC-E barcodes
      'code-128',    // Code 128 barcodes
      'code-39',     // Code 39 barcodes
      'code-93',     // Code 93 barcodes
      'codabar',     // Codabar barcodes
      'itf',         // ITF barcodes
      // QR codes removed - only scanning barcodes
    ],
    onCodeScanned: (codes) => {
      if (!isActive || codes.length === 0) return;

      // Get the first valid barcode
      const code = codes[0];
      if (code.value) {
        console.log(`Barcode detected: ${code.value} (${code.type})`);
        processScannedISBN(code.value);
      }
    },
  });

  /**
   * Closes confirmation modal and returns to camera
   */
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setScannedISBN(null);
    setScanMessage('');
    setScannedBook(null);
    setIsActive(true);
  };

  /**
   * Opens manual entry modal
   */
  const handleOpenManualEntry = () => {
    setIsActive(false);
    setShowManualEntry(true);
  };

  /**
   * Handles manual ISBN submission
   */
  const handleManualSubmit = (isbn: string) => {
    setShowManualEntry(false);
    processScannedISBN(isbn);
  };

  /**
   * Closes manual entry modal
   */
  const handleCloseManualEntry = () => {
    setShowManualEntry(false);
    setIsActive(true);
  };

  // Loading state while checking permissions
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Checking camera permission...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No camera device available
  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Top bar with title and scan count */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Scan ISBN Barcode</Text>
          <Text style={styles.scanCount}>
            Books scanned: {scanCount}
          </Text>
        </View>

        {/* Scanning frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.scanInstruction}>
            Align barcode within frame
          </Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={handleOpenManualEntry}
          >
            <Text style={styles.manualEntryButtonText}>
              Manual Entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        isbn={scannedISBN}
        bookType={bookType}
        loading={isLoading}
        success={scanSuccess}
        message={scanMessage}
        book={scannedBook}
        onClose={handleCloseModal}
      />

      {/* Manual Entry Modal */}
      <ManualEntryModal
        visible={showManualEntry}
        onSubmit={handleManualSubmit}
        onClose={handleCloseManualEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  scanCount: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00FF00',
    borderWidth: 4,
  },
  topLeft: {
    top: height * 0.3,
    left: width * 0.15,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: height * 0.3,
    right: width * 0.15,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: height * 0.3,
    left: width * 0.15,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: height * 0.3,
    right: width * 0.15,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstruction: {
    position: 'absolute',
    bottom: height * 0.25,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bottomBar: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  manualEntryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  manualEntryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;
