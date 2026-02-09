import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Task } from '../types';

interface Props {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onStartTimer: (taskId: number, minutes: number, usePomodoro: boolean) => void;
}

export const TimerModal: React.FC<Props> = ({ visible, task, onClose, onStartTimer }) => {
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [usePomodoro, setUsePomodoro] = useState(false);

  useEffect(() => {
    if (task?.estimatedMinutes) {
      setEstimatedMinutes(task.estimatedMinutes.toString());
    } else {
      setEstimatedMinutes('');
    }
  }, [task]);

  const handleStart = () => {
    const minutes = parseInt(estimatedMinutes);
    if (!minutes || minutes <= 0) {
      Alert.alert('Error', 'Please enter a valid time estimate');
      return;
    }

    if (task) {
      onStartTimer(task.id, minutes, usePomodoro);
      onClose();
    }
  };

  const quickTimes = [15, 25, 30, 45, 60, 90, 120];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Start Timer</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Task Name */}
          <View style={styles.taskContainer}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.taskName} numberOfLines={2}>
              {task?.name}
            </Text>
          </View>

          {/* Time Input */}
          <View style={styles.section}>
            <Text style={styles.label}>How long will this take?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={estimatedMinutes}
                onChangeText={setEstimatedMinutes}
                keyboardType="number-pad"
                placeholder="30"
                placeholderTextColor={COLORS.textMuted}
              />
              <Text style={styles.unit}>minutes</Text>
            </View>

            {/* Quick Time Buttons */}
            <View style={styles.quickTimes}>
              {quickTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.quickButton}
                  onPress={() => setEstimatedMinutes(time.toString())}
                >
                  <Text style={styles.quickButtonText}>{time}m</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pomodoro Option */}
          <TouchableOpacity
            style={styles.pomodoroOption}
            onPress={() => setUsePomodoro(!usePomodoro)}
            activeOpacity={0.7}
          >
            <View style={styles.pomodoroLeft}>
              <MaterialCommunityIcons
                name={usePomodoro ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={usePomodoro ? COLORS.primary : COLORS.textSecondary}
              />
              <View style={styles.pomodoroText}>
                <Text style={styles.pomodoroTitle}>Use Pomodoro Technique</Text>
                <Text style={styles.pomodoroSubtitle}>25 min work + 5 min break</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="timer-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <MaterialCommunityIcons name="play" size={24} color={COLORS.background} />
            <Text style={styles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    gap: 12,
  },
  taskName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  unit: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  quickTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.darkGray,
    borderRadius: 8,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pomodoroOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 20,
  },
  pomodoroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pomodoroText: {
    flex: 1,
  },
  pomodoroTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  pomodoroSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});