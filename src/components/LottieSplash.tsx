import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

interface LottieSplashProps {
  onAnimationFinish: () => void;
}

export const LottieSplash: React.FC<LottieSplashProps> = ({ onAnimationFinish }) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <Animated.View exiting={FadeOut.duration(300)} style={styles.container}>
      <LottieView
        ref={animationRef}
        source={{
          uri: 'https://lottie.host/embed/4db68bbd-31f6-4cd8-84eb-189de081159a/IGM3nV4lPm.json',
        }}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
      <Text style={styles.title}>Mini Project Manager</Text>
      <Text style={styles.subtitle}>Organize your work</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EE',
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
});
