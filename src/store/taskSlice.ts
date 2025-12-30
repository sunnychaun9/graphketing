import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types';
import { StorageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
}

const initialState: TaskState = {
  tasks: StorageService.getTasks(),
  isLoading: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      StorageService.saveTasks(action.payload);
    },
    addTask: (
      state,
      action: PayloadAction<{
        projectId: string;
        title: string;
        status: TaskStatus;
      }>
    ) => {
      const newTask: Task = {
        id: uuidv4(),
        projectId: action.payload.projectId,
        title: action.payload.title,
        description: '',
        dueDate: new Date().toISOString(),
        assignedUser: '',
        estimatedHours: 0,
        status: action.payload.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      StorageService.saveTasks(state.tasks);
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        StorageService.saveTasks(state.tasks);
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: TaskStatus }>
    ) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          status: action.payload.status,
          updatedAt: new Date().toISOString(),
        };
        StorageService.saveTasks(state.tasks);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      StorageService.saveTasks(state.tasks);
    },
    deleteTasksByProject: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.projectId !== action.payload);
      StorageService.saveTasks(state.tasks);
    },
    setTaskLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  deleteTasksByProject,
  setTaskLoading,
} = taskSlice.actions;
export default taskSlice.reducer;
