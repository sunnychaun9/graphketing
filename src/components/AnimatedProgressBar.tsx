import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Theme } from '../utils/theme';

interface AnimatedProgressBarProps {
  progress: number;
  theme: Theme;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = React.memo(
  ({ progress, theme }) => {
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
      animatedWidth.value = withTiming(progress, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }, [progress, animatedWidth]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: `${animatedWidth.value}%`,
      };
    });

    const getProgressColor = () => {
      if (progress < 30) return theme.error;
      if (progress < 70) return theme.warning;
      return theme.success;
    };

    return (
      <View style={styles.container}>
        <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: getProgressColor() },
              animatedStyle,
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          {progress}%
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
});
