/**
 * Manual Entry Modal Component
 * Allows users to manually enter ISBN when barcode is damaged or unreadable
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

interface ManualEntryModalProps {
  visible: boolean;
  onSubmit: (isbn: string) => void;
  onClose: () => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  visible,
  onSubmit,
  onClose,
}) => {
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');

  /**
   * Validates ISBN format (basic validation for 10 or 13 digits)
   */
  const validateISBN = (value: string): boolean => {
    // Remove any hyphens or spaces
    const cleanedISBN = value.replace(/[-\s]/g, '');

    // Check if it's 10 or 13 digits
    if (cleanedISBN.length !== 10 && cleanedISBN.length !== 13) {
      setError('ISBN must be 10 or 13 digits');
      return false;
    }

    // Check if it contains only digits (and optionally X for ISBN-10)
    const isValidFormat = /^[\dX]+$/i.test(cleanedISBN);
    if (!isValidFormat) {
      setError('ISBN must contain only digits');
      return false;
    }

    setError('');
    return true;
  };

  /**
   * Handles submission of manual ISBN entry
   */
  const handleSubmit = () => {
    if (!isbn.trim()) {
      setError('Please enter an ISBN');
      return;
    }

    if (validateISBN(isbn)) {
      const cleanedISBN = isbn.replace(/[-\s]/g, '');
      onSubmit(cleanedISBN);
      setIsbn('');
      setError('');
    }
  };

  /**
   * Handles closing the modal
   */
  const handleClose = () => {
    setIsbn('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Enter ISBN Manually</Text>
          <Text style={styles.subtitle}>
            For damaged or unreadable barcodes
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Enter ISBN (10 or 13 digits)"
              placeholderTextColor="#999"
              value={isbn}
              onChangeText={(text) => {
                setIsbn(text);
                setError('');
              }}
              keyboardType="numeric"
              autoFocus
              maxLength={17} // Allow for hyphens
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleLabel}>Example:</Text>
            <Text style={styles.exampleText}>
              978-0-123456-78-9 or 0123456789
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoid: {
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  exampleContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  exampleLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ManualEntryModal;
