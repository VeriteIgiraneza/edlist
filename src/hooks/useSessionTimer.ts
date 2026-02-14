import { useState, useEffect } from 'react';
import { Task } from '../types';

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  selected: boolean;
}

export const useSessionTimer = (
  isActive: boolean,
  selectedTasks: TaskWithTime[],
  onSessionComplete: () => void,
  onTaskComplete: () => void
) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  useEffect(() => {
    if (!isActive || isPaused || timeLeft <= 0) return;

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
  }, [isActive, isPaused, timeLeft]);

  const handleTaskComplete = () => {
    if (currentTaskIndex < selectedTasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      setTimeLeft((selectedTasks[nextIndex].sessionMinutes || 0) * 60);
    } else {
      onSessionComplete();
    }
    onTaskComplete();
  };

  const startTimer = () => {
    if (selectedTasks.length > 0) {
      setCurrentTaskIndex(0);
      setTimeLeft((selectedTasks[0].sessionMinutes || 0) * 60);
      setTotalTimeSpent(0);
    }
  };

  const reset = () => {
    setCurrentTaskIndex(0);
    setTimeLeft(0);
    setIsPaused(false);
    setTotalTimeSpent(0);
  };

  return {
    currentTaskIndex,
    timeLeft,
    isPaused,
    totalTimeSpent,
    setIsPaused,
    startTimer,
    reset,
    handleTaskComplete,
  };
};