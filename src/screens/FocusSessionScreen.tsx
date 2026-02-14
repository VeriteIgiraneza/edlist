import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { useFolders } from '../contexts/FolderContext';
import { PlanningView } from '../components/focus/PlanningView';
import { ActiveSessionView } from '../components/focus/ActiveSessionView';
import { useSessionTimer } from '../hooks/useSessionTimer';

type FocusSessionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FocusSession'>;

interface Props {
  navigation: FocusSessionScreenNavigationProp;
}

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

type TimePeriod = 'today' | 'week' | 'month';

export const FocusSessionScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, updateTask } = useTasks();
  const { folders } = useFolders();

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [sessionTasks, setSessionTasks] = useState<TaskWithTime[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const selectedTasksWithTime = sessionTasks.filter(t => t.selected && t.sessionMinutes);

  const {
    currentTaskIndex,
    timeLeft,
    isPaused,
    totalTimeSpent,
    setIsPaused,
    startTimer,
    reset,
    handleTaskComplete: timerTaskComplete,
  } = useSessionTimer(
    isSessionActive,
    selectedTasksWithTime,
    () => endSession(),
    () => completeCurrentTask()
  );

  useEffect(() => {
    loadTasksForPeriod();
  }, [tasks, selectedPeriod]);

  const loadTasksForPeriod = () => {
    const now = new Date();
    const incompleteTasks = tasks.filter(t => !t.completed);

    let filteredTasks: Task[] = [];

    if (selectedPeriod === 'today') {
      filteredTasks = incompleteTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === now.toDateString();
      });
    } else if (selectedPeriod === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      filteredTasks = incompleteTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= weekStart && dueDate < weekEnd;
      });
    } else if (selectedPeriod === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filteredTasks = incompleteTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= monthStart && dueDate <= monthEnd;
      });
    }

    const tasksWithTime = filteredTasks.map(task => ({
      ...task,
      sessionMinutes: task.estimatedMinutes || undefined,
      selected: false,
    }));

    setSessionTasks(tasksWithTime);
  };

  const getStats = () => {
    const total = sessionTasks.length;
    const selected = sessionTasks.filter(t => t.selected).length;
    const withTime = sessionTasks.filter(t => t.selected && t.sessionMinutes).length;
    const totalMinutes = sessionTasks
      .filter(t => t.selected && t.sessionMinutes)
      .reduce((sum, t) => sum + (t.sessionMinutes || 0), 0);

    return { total, selected, withTime, totalMinutes };
  };

  const getFolderName = (folderId: number): string => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : 'Unknown';
  };

  const getFolderColor = (folderId: number): string => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.color : '#999';
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

  const selectAll = () => {
    setSessionTasks(prev => prev.map(task => ({ ...task, selected: true })));
  };

  const deselectAll = () => {
    setSessionTasks(prev => prev.map(task => ({ ...task, selected: false })));
  };

  const startSession = () => {
    const selected = sessionTasks.filter(t => t.selected && t.sessionMinutes);

    if (selected.length === 0) {
      Alert.alert('No Tasks Ready', 'Please select tasks and assign time to each.');
      return;
    }

    setIsSessionActive(true);
    startTimer();
    setCompletedTasks([]);
  };

  const completeCurrentTask = async () => {
    const currentTask = selectedTasksWithTime[currentTaskIndex];

    if (currentTask) {
      await updateTask({
        ...currentTask,
        completed: true,
        actualMinutes: Math.floor(((currentTask.sessionMinutes || 0) * 60 - timeLeft) / 60),
      });

      setCompletedTasks(prev => [...prev, currentTask.name]);
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    reset();
    showSummary();
  };

  const showSummary = () => {
    const mins = Math.floor(totalTimeSpent / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    const timeString = hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins} minutes`;

    Alert.alert(
      'Session Complete!',
      `Completed ${completedTasks.length} tasks in ${timeString}!\n\n✓ ${completedTasks.join('\n✓ ')}`,
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

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (isSessionActive) {
    const currentTask = selectedTasksWithTime[currentTaskIndex];
    const upcomingTasks = selectedTasksWithTime.slice(currentTaskIndex + 1);

    return (
      <ActiveSessionView
        currentTask={currentTask}
        currentTaskIndex={currentTaskIndex}
        totalTasks={selectedTasksWithTime.length}
        timeLeft={timeLeft}
        isPaused={isPaused}
        upcomingTasks={upcomingTasks}
        getFolderName={getFolderName}
        getFolderColor={getFolderColor}
        formatDueDate={formatDueDate}
        formatTime={formatTime}
        onPauseResume={() => setIsPaused(!isPaused)}
        onComplete={timerTaskComplete}
        onEndSession={endSession}
      />
    );
  }

  return (
    <PlanningView
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
      sessionTasks={sessionTasks}
      stats={getStats()}
      onToggleSelection={toggleTaskSelection}
      onUpdateTime={updateTaskTime}
      onSelectAll={selectAll}
      onDeselectAll={deselectAll}
      onStartSession={startSession}
      getFolderName={getFolderName}
      getFolderColor={getFolderColor}
      formatDueDate={formatDueDate}
      onClose={() => navigation.goBack()}
    />
  );
};