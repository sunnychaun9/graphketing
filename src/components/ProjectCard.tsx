import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Project } from '../types';
import { AnimatedProgressBar } from './AnimatedProgressBar';
import { useProjectStats } from '../hooks/useProjectStats';
import { Theme } from '../utils/theme';

interface ProjectCardProps {
  project: Project;
  index: number;
  theme: Theme;
  onPress: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ project, index, theme, onPress }) => {
    const stats = useProjectStats(project.id);

    const handlePress = useCallback(() => {
      onPress(project);
    }, [onPress, project]);

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              shadowColor: theme.cardShadow,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {project.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={styles.badgeText}>{stats.totalTasks} tasks</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: theme.todoColumnDark }]} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {stats.todoCount} To Do
              </Text>
            </View>
            <View style={styles.statItem}>
              <View
                style={[styles.statDot, { backgroundColor: theme.inProgressColumnDark }]}
              />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {stats.inProgressCount} In Progress
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: theme.doneColumnDark }]} />
              <Text style={[styles.statText, { color: theme.textSecondary }]}>
                {stats.doneCount} Done
              </Text>
            </View>
          </View>

          <AnimatedProgressBar progress={stats.completionPercentage} theme={theme} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
  },
});
