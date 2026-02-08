import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DatabaseService from '../database/DatabaseService';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types';
import { scheduleNotification, cancelNotification, rescheduleAllNotifications } from '../utils/notificationUtils';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  getTasksByFolder: (folderId: number) => Promise<Task[]>;
  createTask: (task: CreateTaskInput) => Promise<number>;
  updateTask: (task: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (task: Task) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await DatabaseService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByFolder = async (folderId: number): Promise<Task[]> => {
    try {
      return await DatabaseService.getTasksByFolder(folderId);
    } catch (error) {
      console.error('Error loading tasks by folder:', error);
      return [];
    }
  };

  const createTask = async (task: CreateTaskInput): Promise<number> => {
    try {
      const id = await DatabaseService.createTask(task);
      
      // Schedule notification if reminder is set
      if (task.reminder) {
        const newTask: Task = {
          id,
          name: task.name,
          folderId: task.folderId,
          dueDate: task.dueDate,
          reminder: task.reminder,
          completed: false,
        };
        await scheduleNotification(newTask);
      }
      
      await refreshTasks();
      return id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (task: UpdateTaskInput): Promise<void> => {
    try {
      // Get old task to check if reminder changed
      const oldTask = await DatabaseService.getTask(task.id);
      
      await DatabaseService.updateTask(task);
      
      // Handle notification
      if (task.reminder && !task.completed) {
        await scheduleNotification(task as Task);
      } else {
        await cancelNotification(task.id.toString());
      }
      
      await refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await cancelNotification(id.toString());
      await DatabaseService.deleteTask(id);
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskCompletion = async (task: Task): Promise<void> => {
    try {
      const updatedTask: UpdateTaskInput = {
        ...task,
        completed: !task.completed,
      };
      await updateTask(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshTasks();
    
    // Reschedule notifications on app start
    rescheduleAllNotifications(tasks);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        refreshTasks,
        getTasksByFolder,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};