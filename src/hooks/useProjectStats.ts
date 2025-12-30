import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { Task } from '../types';

interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

export const useProjectStats = (projectId: string): ProjectStats => {
  const tasks = useAppSelector((state) => state.tasks.tasks);

  return useMemo(() => {
    const projectTasks = tasks.filter((t: Task) => t.projectId === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter((t: Task) => t.status === 'done').length;
    const todoCount = projectTasks.filter((t: Task) => t.status === 'todo').length;
    const inProgressCount = projectTasks.filter(
      (t: Task) => t.status === 'inProgress'
    ).length;
    const doneCount = completedTasks;

    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      todoCount,
      inProgressCount,
      doneCount,
    };
  }, [tasks, projectId]);
};
