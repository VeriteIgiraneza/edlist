import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../../types';
import { COLORS } from '../../constants/colors';
import { StatsCards } from './StatsCards';
import { FocusTaskItem } from './FocusTaskItem';

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

type TimePeriod = 'today' | 'week' | 'month';

interface Props {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  sessionTasks: TaskWithTime[];
  stats: {
    total: number;
    selected: number;
    withTime: number;
    totalMinutes: number;
  };
  onToggleSelection: (taskId: number) => void;
  onUpdateTime: (taskId: number, minutes: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onStartSession: () => void;
  getFolderName: (folderId: number) => string;
  getFolderColor: (folderId: number) => string;
  formatDueDate: (dateString: string) => string;
  onClose: () => void;
}

export const PlanningView: React.FC<Props> = ({
  selectedPeriod,
  onPeriodChange,
  sessionTasks,
  stats,
  onToggleSelection,
  onUpdateTime,
  onSelectAll,
  onDeselectAll,
  onStartSession,
  getFolderName,
  getFolderColor,
  formatDueDate,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Focus Session</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'today' && styles.periodButtonActive]}
          onPress={() => onPeriodChange('today')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'today' && styles.periodButtonTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => onPeriodChange('week')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => onPeriodChange('month')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <StatsCards total={stats.total} selected={stats.selected} totalMinutes={stats.totalMinutes} />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={onSelectAll}>
          <Text style={styles.quickActionText}>Select All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={onDeselectAll}>
          <Text style={styles.quickActionText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      {sessionTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="calendar-blank" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No tasks for this period</Text>
          <Text style={styles.emptySubtext}>
            {selectedPeriod === 'today' && 'No tasks due today'}
            {selectedPeriod === 'week' && 'No tasks due this week'}
            {selectedPeriod === 'month' && 'No tasks due this month'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessionTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FocusTaskItem
              task={item}
              folderName={getFolderName(item.folderId)}
              folderColor={getFolderColor(item.folderId)}
              formatDueDate={formatDueDate}
              onToggleSelection={onToggleSelection}
              onUpdateTime={onUpdateTime}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Start Button */}
      {stats.withTime > 0 && (
        <TouchableOpacity style={styles.startButton} onPress={onStartSession}>
          <MaterialCommunityIcons name="play-circle" size={28} color={COLORS.background} />
          <Text style={styles.startButtonText}>
            Start Session ({stats.withTime} tasks • {stats.totalMinutes}min)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal:16,
    marginBottom: 8,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodButtonTextActive: {
    color: COLORS.background,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.darkGray,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});