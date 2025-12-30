import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store';
import { addProject } from '../store/projectSlice';
import { toggleDarkMode, setSearchQuery } from '../store/appSlice';
import { ProjectCard, FloatingButton, AddModal, SearchBar } from '../components';
import { RootStackParamList, Project } from '../types';
import { getTheme } from '../utils/theme';
import { useSync } from '../hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectList'>;

export const ProjectListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode);
  const searchQuery = useAppSelector((state) => state.app.searchQuery);
  const isSyncing = useAppSelector((state) => state.app.isSyncing);
  const { performSync } = useSync();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  useEffect(() => {
    performSync();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter((p: Project) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const handleProjectPress = useCallback(
    (project: Project) => {
      performSync();
      navigation.navigate('KanbanBoard', {
        projectId: project.id,
        projectTitle: project.title,
      });
    },
    [navigation, performSync]
  );

  const handleAddProject = useCallback(
    (title: string) => {
      dispatch(addProject(title));
    },
    [dispatch]
  );

  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch]
  );

  const renderProject = useCallback(
    ({ item, index }: { item: Project; index: number }) => (
      <ProjectCard
        project={item}
        index={index}
        theme={theme}
        onPress={handleProjectPress}
      />
    ),
    [theme, handleProjectPress]
  );

  const keyExtractor = useCallback((item: Project) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No projects yet
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
          Tap the + button to create your first project
        </Text>
      </View>
    ),
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>My Projects</Text>
        <View style={styles.headerActions}>
          {isSyncing && <ActivityIndicator size="small" color={theme.primary} />}
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.background }]}
            onPress={handleToggleDarkMode}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        placeholder="Search projects..."
        theme={theme}
      />

      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <FloatingButton onPress={() => setIsModalVisible(true)} theme={theme} />

      <AddModal
        visible={isModalVisible}
        title="New Project"
        placeholder="Enter project name"
        theme={theme}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddProject}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  list: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
