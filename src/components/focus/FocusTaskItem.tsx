import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../../types';
import { COLORS } from '../../constants/colors';

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

interface Props {
  task: TaskWithTime;
  folderName: string;
  folderColor: string;
  formatDueDate: (dateString: string) => string;
  onToggleSelection: (taskId: number) => void;
  onUpdateTime: (taskId: number, minutes: string) => void;
}

const QUICK_TIMES = [15, 25, 30, 45, 60];

export const FocusTaskItem: React.FC<Props> = ({
  task,
  folderName,
  folderColor,
  formatDueDate,
  onToggleSelection,
  onUpdateTime,
}) => {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskLeft}
        onPress={() => onToggleSelection(task.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={task.selected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={24}
          color={task.selected ? COLORS.primary : COLORS.textSecondary}
        />
        <View style={styles.taskInfo}>
          <Text style={[styles.taskName, task.selected && styles.taskNameSelected]}>
            {task.name}
          </Text>
          <View style={styles.taskMetaRow}>
            <View style={[styles.folderDot, { backgroundColor: folderColor }]} />
            <Text style={styles.taskFolder}>{folderName}</Text>
            {task.dueDate && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.taskDue}>{formatDueDate(task.dueDate)}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {task.selected && (
        <View style={styles.timeInputSection}>
          <View style={styles.timeInputRow}>
            <TextInput
              style={styles.timeInput}
              value={task.sessionMinutes?.toString() || ''}
              onChangeText={(text) => onUpdateTime(task.id, text)}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.minText}>min</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickTimeScroll}>
            {QUICK_TIMES.map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.quickTimeButton,
                  task.sessionMinutes === time && styles.quickTimeButtonActive
                ]}
                onPress={() => onUpdateTime(task.id, time.toString())}
              >
                <Text style={[
                  styles.quickTimeText,
                  task.sessionMinutes === time && styles.quickTimeTextActive
                ]}>
                  {time}m
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  taskNameSelected: {
    color: COLORS.primary,
  },
  taskMetaRow: {
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
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  separator: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  taskDue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeInputSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  timeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    width: 70,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  minText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickTimeScroll: {
    marginTop: 4,
  },
  quickTimeButton: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  quickTimeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  quickTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  quickTimeTextActive: {
    color: COLORS.background,
  },
});