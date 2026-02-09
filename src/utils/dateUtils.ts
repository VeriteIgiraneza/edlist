import { format, parse, isToday, isPast, isBefore, startOfDay } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from '../constants/config';

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, DATE_FORMAT);
  } catch {
    return '';
  }
};

export const formatTime = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, TIME_FORMAT);
  } catch {
    return '';
  }
};

export const formatDateTime = (date: Date): string => {
  return format(date, DATETIME_FORMAT);
};

export const formatReminderDisplay = (reminderString: string): string => {
  try {
    const date = new Date(reminderString);
    const day = format(date, 'dd');
    const month = format(date, 'MMM').toUpperCase();
    const time = format(date, 'h:mma');
    return `${day} ${month} ${time}`;
  } catch {
    return '';
  }
};

export const getDueDateStatus = (dueDate: string | null): 'overdue' | 'today' | 'future' | null => {
  if (!dueDate) return null;
  
  try {
    const date = new Date(dueDate);
    const dueDateStart = startOfDay(date);
    const todayStart = startOfDay(new Date());
    
    if (isBefore(dueDateStart, todayStart)) return 'overdue';
    if (isToday(dueDateStart)) return 'today';
    return 'future';
  } catch {
    return null;
  }
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};