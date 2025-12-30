import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { store, useAppSelector } from './src/store';
import { AppNavigator } from './src/navigation';
import { StorageService } from './src/services/storage';

const AppContent: React.FC = () => {
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

const AppWrapper: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await StorageService.init();
      setIsReady(true);
    };
    initApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppWrapper />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});
