import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Task, TaskStatus } from '../types';
import { Theme } from '../utils/theme';
import { COLUMN_WIDTH } from '../utils/constants';

interface TaskCardProps {
  task: Task;
  theme: Theme;
  onPress: (task: Task) => void;
  onDragEnd: (taskId: string, newStatus: TaskStatus) => void;
  columnPositions: { [key in TaskStatus]: number };
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(
  ({ task, theme, onPress, onDragEnd, columnPositions }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);
    const opacity = useSharedValue(1);

    const determineColumn = (x: number): TaskStatus => {
      const todoEnd = columnPositions.todo + COLUMN_WIDTH;
      const inProgressEnd = columnPositions.inProgress + COLUMN_WIDTH;

      if (x < todoEnd) return 'todo';
      if (x < inProgressEnd) return 'inProgress';
      return 'done';
    };

    const panGesture = Gesture.Pan()
      .onStart(() => {
        scale.value = withSpring(1.05);
        zIndex.value = 100;
        opacity.value = 0.9;
      })
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      })
      .onEnd((event) => {
        const currentColumnX = columnPositions[task.status];
        const absoluteX = currentColumnX + event.translationX + COLUMN_WIDTH / 2;
        const newStatus = determineColumn(absoluteX);

        if (newStatus !== task.status) {
          runOnJS(onDragEnd)(task.id, newStatus);
        }

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        zIndex.value = 0;
        opacity.value = 1;
      });

    const tapGesture = Gesture.Tap().onEnd(() => {
      runOnJS(onPress)(task);
    });

    const composedGestures = Gesture.Race(panGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: zIndex.value,
      opacity: opacity.value,
    }));

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <GestureDetector gesture={composedGestures}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              shadowColor: theme.cardShadow,
            },
            animatedStyle,
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {formatDate(task.dueDate)}
            </Text>

            {task.imageUri ? (
              <Image source={{ uri: task.imageUri }} style={styles.thumbnail} />
            ) : null}

            {task.assignedUser && task.assignedUser !== 'Unassigned' ? (
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>
                  {task.assignedUser
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 11,
  },
  thumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
