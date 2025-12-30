import { Project, Task } from '../types';

interface SyncData {
  projects: Project[];
  tasks: Task[];
}

export const fakeSyncServer = async (localData: SyncData): Promise<SyncData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(localData), 1500);
  });
};

export const syncData = async (projects: Project[], tasks: Task[]): Promise<SyncData> => {
  try {
    const result = await fakeSyncServer({ projects, tasks });
    console.log('Sync completed successfully');
    return result;
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};
