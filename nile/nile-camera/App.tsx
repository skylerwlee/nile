/**
 * Main App Component
 * Entry point for the Book Scanner Application
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CameraScreen from './src/components/CameraScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <CameraScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
