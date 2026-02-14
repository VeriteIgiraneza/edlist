import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../../types';
import { COLORS } from '../../constants/colors';

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

interface Props {
  currentTask: TaskWithTime;
  currentTaskIndex: number;
  totalTasks: number;
  timeLeft: number;
  isPaused: boolean;
  upcomingTasks: TaskWithTime[];
  getFolderName: (folderId: number) => string;
  getFolderColor: (folderId: number) => string;
  formatDueDate: (dateString: string) => string;
  formatTime: (seconds: number) => string;
  onPauseResume: () => void;
  onComplete: () => void;
  onEndSession: () => void;
}

export const ActiveSessionView: React.FC<Props> = ({
  currentTask,
  currentTaskIndex,
  totalTasks,
  timeLeft,
  isPaused,
  upcomingTasks,
  getFolderName,
  getFolderColor,
  formatDueDate,
  formatTime,
  onPauseResume,
  onComplete,
  onEndSession,
}) => {
  const progress = ((currentTaskIndex + 1) / totalTasks) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sessionTitle}>Focus Session</Text>
        <TouchableOpacity onPress={onEndSession}>
          <MaterialCommunityIcons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Task {currentTaskIndex + 1} of {totalTasks}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Current Task */}
      <View style={styles.currentTaskCard}>
        <Text style={styles.currentTaskLabel}>Current Task</Text>
        <Text style={styles.currentTaskName}>{currentTask.name}</Text>
        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <View style={[styles.folderDot, { backgroundColor: getFolderColor(currentTask.folderId) }]} />
            <Text style={styles.taskFolder}>{getFolderName(currentTask.folderId)}</Text>
          </View>
          {currentTask.dueDate && (
            <Text style={styles.taskDue}>📅 Due {formatDueDate(currentTask.dueDate)}</Text>
          )}
        </View>
      </View>

      {/* Timer */}
      <View style={styles.timerSection}>
        <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>

        <View style={styles.timerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onPauseResume}>
            <MaterialCommunityIcons
              name={isPaused ? 'play' : 'pause'}
              size={32}
              color={COLORS.textPrimary}
            />
            <Text style={styles.controlButtonText}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={onComplete}>
            <MaterialCommunityIcons
              name="check-circle"
              size={32}
              color={COLORS.success}
            />
            <Text style={styles.controlButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <View style={styles.upcomingSection}>
          <Text style={styles.upcomingTitle}>Up Next:</Text>
          {upcomingTasks.map((task, index) => (
            <View key={task.id} style={styles.upcomingTaskItem}>
              <Text style={styles.upcomingTask}>
                {index + 1}. {task.name}
              </Text>
              <Text style={styles.upcomingTime}>{task.sessionMinutes}min</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  progressSection: {
    paddingHorizontal: 2,
    marginBottom: 32,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  currentTaskCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 2,
    padding: 24,
    borderRadius: 16,
    marginBottom: 40,
  },
  currentTaskLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  currentTaskName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  folderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskFolder: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  taskDue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 32,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 24,
  },
  controlButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  upcomingSection: {
    paddingHorizontal: 20,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  upcomingTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    marginBottom: 8,
  },
  upcomingTask: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  upcomingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});