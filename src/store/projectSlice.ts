import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types';
import { StorageService } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
}

const initialState: ProjectState = {
  projects: StorageService.getProjects(),
  isLoading: false,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      StorageService.saveProjects(action.payload);
    },
    addProject: (state, action: PayloadAction<string>) => {
      const newProject: Project = {
        id: uuidv4(),
        title: action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.projects.push(newProject);
      StorageService.saveProjects(state.projects);
    },
    updateProject: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          title: action.payload.title,
          updatedAt: new Date().toISOString(),
        };
        StorageService.saveProjects(state.projects);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      StorageService.saveProjects(state.projects);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProjects, addProject, updateProject, deleteProject, setLoading } =
  projectSlice.actions;
export default projectSlice.reducer;
