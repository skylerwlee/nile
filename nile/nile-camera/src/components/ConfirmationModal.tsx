/**
 * Confirmation Modal Component
 * Shows the scanned ISBN with book metadata and success/error message
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { BookData } from '../types/Book';

interface ConfirmationModalProps {
  visible: boolean;
  isbn: string | null;
  bookType: 'textbook' | 'other';
  loading: boolean;
  success: boolean;
  message?: string;
  book?: BookData | null;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  isbn,
  bookType,
  loading,
  success,
  message,
  book,
  onClose,
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.container}>
        {loading ? (
          // Loading state while posting to API
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing scan...</Text>
          </View>
        ) : (
          // Display result
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.iconContainer, success ? styles.successIcon : styles.errorIcon]}>
              <Text style={styles.icon}>{success ? '✓' : '✕'}</Text>
            </View>

            <Text style={styles.title}>{success ? 'Scan Saved!' : 'Error'}</Text>

            {/* Book metadata section */}
            {success && book && (
              <View style={styles.bookSection}>
                <Text style={styles.bookTitle}>{book.title}</Text>

                {book.subtitle && (
                  <Text style={styles.bookSubtitle}>{book.subtitle}</Text>
                )}

                {book.authors && book.authors.length > 0 && (
                  <Text style={styles.bookAuthors}>
                    by {book.authors.join(', ')}
                  </Text>
                )}

                <View style={styles.bookDetails}>
                  {book.publisher && (
                    <Text style={styles.detailText}>📚 {book.publisher}</Text>
                  )}

                  {book.published_date && (
                    <Text style={styles.detailText}>📅 {book.published_date}</Text>
                  )}

                  {book.quantity_available !== undefined && (
                    <Text style={[styles.detailText, styles.quantityText]}>
                      📦 {book.quantity_available} available
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* ISBN display */}
            {isbn && (
              <View style={styles.isbnContainer}>
                <Text style={styles.isbnLabel}>ISBN:</Text>
                <Text style={styles.isbnValue}>{isbn}</Text>
              </View>
            )}

            {/* Book Type Display */}
            <View style={[styles.bookTypeContainer, bookType === 'textbook' ? styles.textbookType : styles.otherType]}>
              <Text style={styles.bookTypeLabel}>Book Type:</Text>
              <Text style={styles.bookTypeValue}>{bookType.toUpperCase()}</Text>
            </View>

            {/* Message */}
            {message && !book && (
              <Text style={styles.message}>{message}</Text>
            )}

            {/* Close button */}
            <TouchableOpacity
              style={[styles.button, success ? styles.successButton : styles.errorButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Continue Scanning</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 32,
    minHeight: 280,
    maxHeight: '85%',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  successIcon: {
    backgroundColor: '#4CAF50',
  },
  errorIcon: {
    backgroundColor: '#d32f2f',
  },
  icon: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  bookSection: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  bookSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bookAuthors: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  bookDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  isbnContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  isbnLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  isbnValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  bookTypeContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  textbookType: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  otherType: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  bookTypeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  bookTypeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ConfirmationModal;
