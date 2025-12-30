import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Theme } from '../utils/theme';
import { COLUMN_WIDTH } from '../utils/constants';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  theme: Theme;
  columnPositions: { [key in TaskStatus]: number };
  onTaskPress: (task: Task) => void;
  onTaskDragEnd: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(
  ({
    title,
    status,
    tasks,
    theme,
    columnPositions,
    onTaskPress,
    onTaskDragEnd,
    onAddTask,
  }) => {
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue(0);

    const getColumnColor = () => {
      switch (status) {
        case 'todo':
          return theme.todoColumn;
        case 'inProgress':
          return theme.inProgressColumn;
        case 'done':
          return theme.doneColumn;
      }
    };

    const getHeaderColor = () => {
      switch (status) {
        case 'todo':
          return theme.todoColumnDark;
        case 'inProgress':
          return theme.inProgressColumnDark;
        case 'done':
          return theme.doneColumnDark;
      }
    };

    const handleAddPress = useCallback(() => {
      onAddTask(status);
    }, [onAddTask, status]);

    const animatedColumnStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const renderTask = useCallback(
      ({ item }: { item: Task }) => (
        <TaskCard
          task={item}
          theme={theme}
          onPress={onTaskPress}
          onDragEnd={onTaskDragEnd}
          columnPositions={columnPositions}
        />
      ),
      [theme, onTaskPress, onTaskDragEnd, columnPositions]
    );

    const keyExtractor = useCallback((item: Task) => item.id, []);

    return (
      <Animated.View
        style={[
          styles.column,
          { backgroundColor: getColumnColor() },
          animatedColumnStyle,
        ]}
      >
        <View style={[styles.header, { backgroundColor: getHeaderColor() }]}>
          <Text style={styles.headerText}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{tasks.length}</Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={keyExtractor}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: getHeaderColor() }]}
          onPress={handleAddPress}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  column: {
    width: COLUMN_WIDTH,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
    minHeight: 200,
  },
  taskListContent: {
    padding: 8,
  },
  addButton: {
    margin: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
