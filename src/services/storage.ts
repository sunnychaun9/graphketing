import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, Task } from '../types';

const KEYS = {
  PROJECTS: '@minipm_projects',
  TASKS: '@minipm_tasks',
  DARK_MODE: '@minipm_darkMode',
};

// In-memory cache for synchronous access
let projectsCache: Project[] = [];
let tasksCache: Task[] = [];
let darkModeCache: boolean = false;
let initialized = false;

export const StorageService = {
  // Initialize - load from AsyncStorage into cache
  init: async (): Promise<void> => {
    if (initialized) return;

    try {
      const [projectsData, tasksData, darkModeData] = await Promise.all([
        AsyncStorage.getItem(KEYS.PROJECTS),
        AsyncStorage.getItem(KEYS.TASKS),
        AsyncStorage.getItem(KEYS.DARK_MODE),
      ]);

      projectsCache = projectsData ? JSON.parse(projectsData) : [];
      tasksCache = tasksData ? JSON.parse(tasksData) : [];
      darkModeCache = darkModeData === 'true';
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  },

  // Projects
  getProjects: (): Project[] => {
    return projectsCache;
  },

  saveProjects: (projects: Project[]): void => {
    projectsCache = projects;
    AsyncStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects)).catch(console.error);
  },

  // Tasks
  getTasks: (): Task[] => {
    return tasksCache;
  },

  saveTasks: (tasks: Task[]): void => {
    tasksCache = tasks;
    AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)).catch(console.error);
  },

  // Dark Mode
  getDarkMode: (): boolean => {
    return darkModeCache;
  },

  saveDarkMode: (isDark: boolean): void => {
    darkModeCache = isDark;
    AsyncStorage.setItem(KEYS.DARK_MODE, isDark.toString()).catch(console.error);
  },

  // Clear all data
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([KEYS.PROJECTS, KEYS.TASKS, KEYS.DARK_MODE]);
      projectsCache = [];
      tasksCache = [];
      darkModeCache = false;
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  // Check if initialized
  isInitialized: (): boolean => {
    return initialized;
  },
};
