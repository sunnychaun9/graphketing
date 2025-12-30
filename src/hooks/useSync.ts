import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSyncing } from '../store/appSlice';
import { syncData } from '../services/syncService';

export const useSync = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const isSyncing = useAppSelector((state) => state.app.isSyncing);

  const performSync = useCallback(async () => {
    if (isSyncing) return;

    try {
      dispatch(setSyncing(true));
      await syncData(projects, tasks);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      dispatch(setSyncing(false));
    }
  }, [dispatch, projects, tasks, isSyncing]);

  return { performSync, isSyncing };
};
