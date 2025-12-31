import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '../store';
import { addTask, updateTaskStatus } from '../store/taskSlice';
import { KanbanColumn, AddModal } from '../components';
import { RootStackParamList, Task, TaskStatus } from '../types';
import { getTheme } from '../utils/theme';
import { COLUMN_WIDTH } from '../utils/constants';
import { useSync } from '../hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'KanbanBoard'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const KanbanBoardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { projectId, projectTitle } = route.params;
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode);
  const { performSync } = useSync();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>('todo');

  // Shared value for column hover highlight
  const activeDropColumn = useSharedValue('');

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  const projectTasks = useMemo(
    () => tasks.filter((t: Task) => t.projectId === projectId),
    [tasks, projectId]
  );

  const todoTasks = useMemo(
    () => projectTasks.filter((t: Task) => t.status === 'todo'),
    [projectTasks]
  );

  const inProgressTasks = useMemo(
    () => projectTasks.filter((t: Task) => t.status === 'inProgress'),
    [projectTasks]
  );

  const doneTasks = useMemo(
    () => projectTasks.filter((t: Task) => t.status === 'done'),
    [projectTasks]
  );

  const columnPositions = useMemo(
    () => ({
      todo: 8,
      inProgress: 8 + COLUMN_WIDTH + 16,
      done: 8 + (COLUMN_WIDTH + 16) * 2,
    }),
    []
  );

  const handleTaskPress = useCallback(
    (task: Task) => {
      navigation.navigate('TaskDetails', {
        taskId: task.id,
        projectId: projectId,
      });
    },
    [navigation, projectId]
  );

  const handleTaskDragEnd = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      dispatch(updateTaskStatus({ taskId, status: newStatus }));
      performSync();
    },
    [dispatch, performSync]
  );

  const handleAddTask = useCallback((status: TaskStatus) => {
    setSelectedColumn(status);
    setIsModalVisible(true);
  }, []);

  const handleSubmitTask = useCallback(
    (title: string) => {
      dispatch(
        addTask({
          projectId,
          title,
          status: selectedColumn,
        })
      );
      performSync();
    },
    [dispatch, projectId, selectedColumn, performSync]
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {projectTitle}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View entering={FadeIn.duration(300)} style={styles.boardContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.board}
          decelerationRate="fast"
          snapToInterval={COLUMN_WIDTH + 16}
          snapToAlignment="start"
        >
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            theme={theme}
            columnPositions={columnPositions}
            onTaskPress={handleTaskPress}
            onTaskDragEnd={handleTaskDragEnd}
            onAddTask={handleAddTask}
            activeDropColumn={activeDropColumn}
          />
          <KanbanColumn
            title="In Progress"
            status="inProgress"
            tasks={inProgressTasks}
            theme={theme}
            columnPositions={columnPositions}
            onTaskPress={handleTaskPress}
            onTaskDragEnd={handleTaskDragEnd}
            onAddTask={handleAddTask}
            activeDropColumn={activeDropColumn}
          />
          <KanbanColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            theme={theme}
            columnPositions={columnPositions}
            onTaskPress={handleTaskPress}
            onTaskDragEnd={handleTaskDragEnd}
            onAddTask={handleAddTask}
            activeDropColumn={activeDropColumn}
          />
        </ScrollView>
      </Animated.View>

      <AddModal
        visible={isModalVisible}
        title={`Add Task to ${
          selectedColumn === 'todo'
            ? 'To Do'
            : selectedColumn === 'inProgress'
            ? 'In Progress'
            : 'Done'
        }`}
        placeholder="Enter task title"
        theme={theme}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmitTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  boardContainer: {
    flex: 1,
  },
  board: {
    paddingVertical: 16,
    paddingRight: 16,
  },
});
