import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import { store, useAppSelector } from './src/store';
import { AppNavigator } from './src/navigation';
import { StorageService } from './src/services/storage';
import { setProjects } from './src/store/projectSlice';
import { setTasks } from './src/store/taskSlice';
import { setDarkMode } from './src/store/appSlice';
import { LottieSplash } from './src/components';
import { NotificationService } from './src/services/notifications';

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
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await StorageService.init();
      // Load persisted data into Redux store after storage is initialized
      store.dispatch(setProjects(StorageService.getProjects()));
      store.dispatch(setTasks(StorageService.getTasks()));
      store.dispatch(setDarkMode(StorageService.getDarkMode()));

      // Initialize notifications
      await NotificationService.init();

      setIsStorageReady(true);
    };
    initApp();
  }, []);

  const handleSplashFinish = useCallback(() => {
    if (isStorageReady) {
      setShowSplash(false);
    }
  }, [isStorageReady]);

  // Keep showing splash until both animation finishes AND storage is ready
  useEffect(() => {
    if (isStorageReady && !showSplash) {
      // Ready to show app
    }
  }, [isStorageReady, showSplash]);

  if (showSplash || !isStorageReady) {
    return <LottieSplash onAnimationFinish={handleSplashFinish} />;
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
});
