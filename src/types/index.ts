export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedUser: string;
  estimatedHours: number;
  status: TaskStatus;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export type RootStackParamList = {
  ProjectList: undefined;
  KanbanBoard: { projectId: string; projectTitle: string };
  TaskDetails: { taskId: string; projectId: string };
};

export interface AppState {
  projects: Project[];
  tasks: Task[];
  isDarkMode: boolean;
  searchQuery: string;
}
