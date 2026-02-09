import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Task } from '../types';

interface Props {
  task: Task;
  onStop: () => void;
  onComplete: () => void;
}

export const ActiveTimerBar: React.FC<Props> = ({ task, onStop, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!task.timerStartedAt || !task.estimatedMinutes) return;

    const startTime = new Date(task.timerStartedAt).getTime();
    const totalSeconds = task.estimatedMinutes * 60;

    const interval = setInterval(() => {
      if (!isPaused) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = totalSeconds - elapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          handleTimerComplete();
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task, isPaused]);

  const handleTimerComplete = () => {
    // Play notification sound / vibrate
    Alert.alert(
      '⏰ Time\'s Up!',
      `Timer completed for "${task.name}"`,
      [
        { text: 'Take Break', onPress: () => startBreak() },
        { text: 'Mark Complete', onPress: onComplete },
        { text: 'Add 15 min', onPress: () => addTime(15) },
      ]
    );
  };

  const startBreak = () => {
    setIsBreak(true);
    setTimeLeft(5 * 60); // 5 minute break
  };

  const addTime = (minutes: number) => {
    setTimeLeft(timeLeft + (minutes * 60));
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: onStop },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.left}>
          <MaterialCommunityIcons
            name={isBreak ? 'coffee' : 'timer-sand'}
            size={20}
            color={isBreak ? COLORS.success : COLORS.primary}
          />
          <View style={styles.textContainer}>
            <Text style={styles.taskName} numberOfLines={1}>
              {isBreak ? 'Break Time' : task.name}
            </Text>
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)} style={styles.actionButton}>
            <MaterialCommunityIcons
              name={isPaused ? 'play' : 'pause'}
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStop} style={styles.actionButton}>
            <MaterialCommunityIcons name="stop" size={24} color={COLORS.error} />
          </TouchableOpacity>

          {!isBreak && (
            <TouchableOpacity onPress={onComplete} style={styles.actionButton}>
              <MaterialCommunityIcons name="check" size={24} color={COLORS.success} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${task.estimatedMinutes ? (timeLeft / (task.estimatedMinutes * 60)) * 100 : 0}%`,
              backgroundColor: isBreak ? COLORS.success : COLORS.primary,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.darkGray,
  },
  progressBar: {
    height: '100%',
  },
});