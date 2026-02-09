import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { useFolders } from '../contexts/FolderContext';
import { COLORS } from '../constants/colors';

type FocusSessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FocusSession'>;

interface Props {
  navigation: FocusSessionScreenNavigationProp;
}

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

export const FocusSessionScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, updateTask } = useTasks();
  const { folders } = useFolders();
  
  const [sessionTasks, setSessionTasks] = useState<TaskWithTime[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  useEffect(() => {
    // Initialize with incomplete tasks
    const incompleteTasks = tasks.filter(t => !t.completed).map(task => ({
      ...task,
      sessionMinutes: task.estimatedMinutes || undefined,
      selected: false,
    }));
    setSessionTasks(incompleteTasks);
  }, [tasks]);

  useEffect(() => {
    if (!isSessionActive || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTaskComplete();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isPaused, timeLeft]);

  const getFolderName = (folderId: number): string => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : 'Unknown';
  };

  const toggleTaskSelection = (taskId: number) => {
    setSessionTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const updateTaskTime = (taskId: number, minutes: string) => {
    const mins = parseInt(minutes) || undefined;
    setSessionTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, sessionMinutes: mins } : task
      )
    );
  };

  const startSession = () => {
    const selected = sessionTasks.filter(t => t.selected && t.sessionMinutes);
    
    if (selected.length === 0) {
      Alert.alert('No Tasks Selected', 'Please select at least one task and set time.');
      return;
    }

    setIsSessionActive(true);
    setCurrentTaskIndex(0);
    setTimeLeft((selected[0].sessionMinutes || 0) * 60);
    setCompletedTasks([]);
    setTotalTimeSpent(0);
  };

  const handleTaskComplete = async () => {
    const selected = sessionTasks.filter(t => t.selected && t.sessionMinutes);
    const currentTask = selected[currentTaskIndex];

    if (currentTask) {
      // Mark task as complete
      await updateTask({
        ...currentTask,
        completed: true,
      });
      
      setCompletedTasks(prev => [...prev, currentTask.name]);

      // Move to next task
      if (currentTaskIndex < selected.length - 1) {
        const nextIndex = currentTaskIndex + 1;
        setCurrentTaskIndex(nextIndex);
        setTimeLeft((selected[nextIndex].sessionMinutes || 0) * 60);
      } else {
        // Session complete
        endSession();
      }
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    showSummary();
  };

  const showSummary = () => {
    const mins = Math.floor(totalTimeSpent / 60);
    Alert.alert(
      '🎉 Session Complete!',
      `Completed ${completedTasks.length} tasks in ${mins} minutes!\n\n${completedTasks.join('\n')}`,
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
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

  const quickTimes = [15, 25, 30, 45, 60];

  if (isSessionActive) {
    const selected = sessionTasks.filter(t => t.selected && t.sessionMinutes);
    const currentTask = selected[currentTaskIndex];
    const progress = ((currentTaskIndex + 1) / selected.length) * 100;

    return (
      <View style={styles.activeContainer}>
        {/* Header */}
        <View style={styles.activeHeader}>
          <Text style={styles.sessionTitle}>Focus Session</Text>
          <TouchableOpacity onPress={endSession}>
            <MaterialCommunityIcons name="close" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Task {currentTaskIndex + 1} of {selected.length}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Current Task */}
        <View style={styles.currentTaskCard}>
          <Text style={styles.currentTaskLabel}>Current Task</Text>
          <Text style={styles.currentTaskName}>{currentTask?.name}</Text>
          <Text style={styles.currentTaskFolder}>
            📁 {getFolderName(currentTask?.folderId || 0)}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerSection}>
          <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
          
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsPaused(!isPaused)}
            >
              <MaterialCommunityIcons
                name={isPaused ? 'play' : 'pause'}
                size={32}
                color={COLORS.textPrimary}
              />
              <Text style={styles.controlButtonText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleTaskComplete}
            >
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
        {currentTaskIndex < selected.length - 1 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.upcomingTitle}>Up Next:</Text>
            {selected.slice(currentTaskIndex + 1).map((task, index) => (
              <Text key={task.id} style={styles.upcomingTask}>
                {index + 1}. {task.name} ({task.sessionMinutes}min)
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Focus Session</Text>
        <View style={{ width: 28 }} />
      </View>

      <Text style={styles.subtitle}>
        Select tasks and assign time for focused work
      </Text>

      {/* Task List */}
      <FlatList
        data={sessionTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              style={styles.taskLeft}
              onPress={() => toggleTaskSelection(item.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={item.selected ? COLORS.primary : COLORS.textSecondary}
              />
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskFolder}>📁 {getFolderName(item.folderId)}</Text>
              </View>
            </TouchableOpacity>

            {item.selected && (
              <View style={styles.timeInputSection}>
                <TextInput
                  style={styles.timeInput}
                  value={item.sessionMinutes?.toString() || ''}
                  onChangeText={(text) => updateTaskTime(item.id, text)}
                  keyboardType="number-pad"
                  placeholder="30"
                  placeholderTextColor={COLORS.textMuted}
                />
                <Text style={styles.minText}>min</Text>
                
                {/* Quick Time Buttons */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickTimeScroll}>
                  {quickTimes.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={styles.quickTimeButton}
                      onPress={() => updateTaskTime(item.id, time.toString())}
                    >
                      <Text style={styles.quickTimeText}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={startSession}>
        <MaterialCommunityIcons name="play-circle" size={28} color={COLORS.background} />
        <Text style={styles.startButtonText}>
          Start Focus Session ({sessionTasks.filter(t => t.selected).length} tasks)
        </Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  taskItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  taskFolder: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
    gap: 8,
  },
  timeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
    width: 60,
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
    flex: 1,
  },
  quickTimeButton: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  quickTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  // Active Session Styles
  activeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  activeHeader: {
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
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
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
    marginBottom: 8,
  },
  currentTaskFolder: {
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
  },
  upcomingTask: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
}); 