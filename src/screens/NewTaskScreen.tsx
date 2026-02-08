import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { COLORS } from '../constants/colors';
import { formatDate, formatTime, formatDateTime } from '../utils/dateUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NewTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewTask'>;
type NewTaskScreenRouteProp = RouteProp<RootStackParamList, 'NewTask'>;

interface Props {
  navigation: NewTaskScreenNavigationProp;
  route: NewTaskScreenRouteProp;
}

export const NewTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { folderId } = route.params;
  const { createTask } = useTasks();
  
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);

  const handleSave = async () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    try {
      await createTask({
        name: taskName.trim(),
        folderId,
        dueDate: dueDate ? formatDateTime(dueDate) : null,
        reminder: reminder ? formatDateTime(reminder) : null,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleReminderDateChange = (event: any, selectedDate?: Date) => {
    setShowReminderDatePicker(false);
    if (selectedDate) {
      const newReminder = reminder || new Date();
      newReminder.setFullYear(selectedDate.getFullYear());
      newReminder.setMonth(selectedDate.getMonth());
      newReminder.setDate(selectedDate.getDate());
      setReminder(new Date(newReminder));
      setShowReminderTimePicker(true);
    }
  };

  const handleReminderTimeChange = (event: any, selectedTime?: Date) => {
    setShowReminderTimePicker(false);
    if (selectedTime) {
      const newReminder = reminder || new Date();
      newReminder.setHours(selectedTime.getHours());
      newReminder.setMinutes(selectedTime.getMinutes());
      newReminder.setSeconds(0);
      newReminder.setMilliseconds(0);
      setReminder(new Date(newReminder));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>New List</Text>

        <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={24}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter List Name"
            placeholderTextColor={COLORS.textMuted}
            value={taskName}
            onChangeText={setTaskName}
            autoFocus
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDueDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, !dueDate && styles.placeholder]}>
            {dueDate ? formatDate(formatDateTime(dueDate)) : 'Due'}
          </Text>
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(null)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.accent} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowReminderDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="bell"
            size={24}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <Text style={[styles.inputText, !reminder && styles.placeholder]}>
            {reminder
              ? `${formatDate(formatDateTime(reminder))} ${formatTime(formatDateTime(reminder))}`
              : 'Reminder'}
          </Text>
          {reminder && (
            <TouchableOpacity onPress={() => setReminder(null)}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.accent} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {showDueDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDueDateChange}
          />
        )}

        {showReminderDatePicker && (
          <DateTimePicker
            value={reminder || new Date()}
            mode="date"
            display="default"
            onChange={handleReminderDateChange}
          />
        )}

        {showReminderTimePicker && (
          <DateTimePicker
            value={reminder || new Date()}
            mode="time"
            display="default"
            onChange={handleReminderTimeChange}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  doneButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  inputText: {
    flex: 1,
    fontSize: 20,
    color: COLORS.accent,
  },
  placeholder: {
    color: COLORS.accent,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.textMuted,
    marginLeft: 32,
  },
});