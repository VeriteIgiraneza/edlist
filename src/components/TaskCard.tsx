import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types';
import { COLORS } from '../constants/colors';
import { formatDate, formatReminderDisplay, getDueDateStatus } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onLongPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onLongPress }) => {
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const hasDueDate = task.dueDate !== null && task.dueDate !== '';
  const hasReminder = task.reminder !== null && task.reminder !== '';

  const getDueDateColor = () => {
    if (task.completed) return COLORS.textMuted;
    if (dueDateStatus === 'overdue') return COLORS.overdue;
    if (dueDateStatus === 'today') return COLORS.dueToday;
    return COLORS.dueSoon;
  };

  const getTaskNameColor = () => {
    if (task.completed) return COLORS.textPrimary;
    if (dueDateStatus === 'overdue') return COLORS.overdue;
    if (dueDateStatus === 'today') return COLORS.dueToday;
    return COLORS.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.completedCard]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      // I have removed the 'circle-outline' and 'checkbox-marked-circle-outline'
      <View style={styles.content}>
        <MaterialCommunityIcons
          // name="checkbox-marked-circle-outline"
          size={6}
          color={COLORS.textSecondary}
          style={styles.icon}
        />
        
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.taskName,
              { color: getTaskNameColor() },
              task.completed && styles.completedText,
            ]}
          >
            {task.name}
          </Text>
          
          {(hasDueDate || hasReminder) && (
            <View style={styles.dateContainer}>
              {hasDueDate && (
                <Text
                  style={[
                    styles.dueDate,
                    { color: getDueDateColor() },
                    task.completed && styles.completedText,
                  ]}
                >
                  {formatDate(task.dueDate)}
                </Text>
              )}
              
              {hasReminder && (
                <Text
                  style={[
                    styles.reminderDate,
                    task.completed && styles.completedText,
                  ]}
                >
                  {formatReminderDisplay(task.reminder)}
                </Text>
              )}
            </View>
          )}
        </View>
        
        {hasReminder && (
          <MaterialCommunityIcons
            name="bell"
            size={24}
            color={COLORS.textPrimary}
            style={[styles.reminderIcon, task.completed && styles.completedIcon]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
  },
  completedCard: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 8,
    paddingRight: 8,
  },
  icon: {
    marginRight: 4,
  },
  textContainer: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  reminderDate: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  reminderIcon: {
    marginLeft: 8,
  },
  completedIcon: {
    opacity: 0.6,
  },
});