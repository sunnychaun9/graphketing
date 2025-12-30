import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector, useAppDispatch } from '../store';
import { updateTask, deleteTask } from '../store/taskSlice';
import { RootStackParamList, Task, TaskStatus } from '../types';
import { getTheme } from '../utils/theme';
import { USERS } from '../utils/constants';
import { useSync } from '../hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId, projectId } = route.params;
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode);
  const { performSync } = useSync();

  const task = useMemo(
    () => tasks.find((t: Task) => t.id === taskId),
    [tasks, taskId]
  );

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const handleFieldChange = useCallback(
    (field: keyof Task, value: string | number) => {
      dispatch(updateTask({ id: taskId, [field]: value }));
      performSync();
    },
    [dispatch, taskId, performSync]
  );

  const handleDeleteTask = useCallback(() => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteTask(taskId));
          navigation.goBack();
        },
      },
    ]);
  }, [dispatch, taskId, navigation]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleFieldChange('imageUri', result.assets[0].uri);
    }
  }, [handleFieldChange]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'inProgress':
        return 'In Progress';
      case 'done':
        return 'Done';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return theme.todoColumnDark;
      case 'inProgress':
        return theme.inProgressColumnDark;
      case 'done':
        return theme.doneColumnDark;
    }
  };

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Task Details</Text>
        <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteButton}>
          <Text style={[styles.deleteIcon, { color: theme.error }]}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        entering={FadeIn.duration(300)}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
            ]}
            value={task.title}
            onChangeText={(text) => handleFieldChange('title', text)}
            placeholder="Task title"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
            ]}
            value={task.description}
            onChangeText={(text) => handleFieldChange('description', text)}
            placeholder="Add a description..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Status</Text>
          <TouchableOpacity
            style={[
              styles.picker,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setShowStatusPicker(!showStatusPicker)}
          >
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel(task.status)}</Text>
            </View>
            <Text style={[styles.pickerArrow, { color: theme.textSecondary }]}>▼</Text>
          </TouchableOpacity>

          {showStatusPicker && (
            <View style={[styles.pickerOptions, { backgroundColor: theme.surface }]}>
              {(['todo', 'inProgress', 'done'] as TaskStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerOption,
                    task.status === status && { backgroundColor: theme.background },
                  ]}
                  onPress={() => {
                    handleFieldChange('status', status);
                    setShowStatusPicker(false);
                  }}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Assigned User */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Assigned To</Text>
          <TouchableOpacity
            style={[
              styles.picker,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={() => setShowUserPicker(!showUserPicker)}
          >
            <Text style={[styles.pickerText, { color: theme.text }]}>
              {task.assignedUser || 'Unassigned'}
            </Text>
            <Text style={[styles.pickerArrow, { color: theme.textSecondary }]}>▼</Text>
          </TouchableOpacity>

          {showUserPicker && (
            <View style={[styles.pickerOptions, { backgroundColor: theme.surface }]}>
              {USERS.map((user) => (
                <TouchableOpacity
                  key={user}
                  style={[
                    styles.pickerOption,
                    task.assignedUser === user && { backgroundColor: theme.background },
                  ]}
                  onPress={() => {
                    handleFieldChange('assignedUser', user);
                    setShowUserPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, { color: theme.text }]}>
                    {user}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Due Date</Text>
          <View
            style={[
              styles.picker,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.pickerText, { color: theme.text }]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
        </View>

        {/* Estimated Hours */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Estimated Hours
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
            ]}
            value={task.estimatedHours.toString()}
            onChangeText={(text) =>
              handleFieldChange('estimatedHours', parseInt(text) || 0)
            }
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* Image */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Attachment</Text>
          <TouchableOpacity
            style={[
              styles.imageContainer,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={handlePickImage}
          >
            {task.imageUri ? (
              <Image source={{ uri: task.imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={[styles.imagePlaceholderText, { color: theme.textSecondary }]}>
                  📷 Tap to add image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Timestamps */}
        <View style={[styles.timestamps, { borderTopColor: theme.border }]}>
          <Text style={[styles.timestampText, { color: theme.textSecondary }]}>
            Created: {formatDate(task.createdAt)}
          </Text>
          <Text style={[styles.timestampText, { color: theme.textSecondary }]}>
            Updated: {formatDate(task.updatedAt)}
          </Text>
        </View>
      </Animated.ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerText: {
    fontSize: 16,
  },
  pickerArrow: {
    fontSize: 12,
  },
  pickerOptions: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: 16,
  },
  pickerOptionText: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  imageContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 150,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
  },
  timestamps: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  timestampText: {
    fontSize: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
