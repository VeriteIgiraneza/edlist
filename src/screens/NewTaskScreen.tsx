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
  ScrollView,
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="close" size={28} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <MaterialCommunityIcons name="check" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Task Name Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Task Name</Text>
          <TextInput
            style={styles.taskNameInput}
            placeholder="What needs to be done?"
            placeholderTextColor={COLORS.textMuted}
            value={taskName}
            onChangeText={setTaskName}
            autoFocus
            multiline
          />
        </View>

        {/* Due Date Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => setShowDueDatePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardLabelContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={COLORS.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Due Date</Text>
            </View>
            {dueDate && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setDueDate(null);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.cardValue, !dueDate && styles.cardPlaceholder]}>
            {dueDate ? formatDate(formatDateTime(dueDate)) : 'Tap to set due date'}
          </Text>
        </TouchableOpacity>

        {/* Reminder Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => setShowReminderDatePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardLabelContainer}>
              <MaterialCommunityIcons
                name="bell-ring"
                size={20}
                color={COLORS.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>Reminder</Text>
            </View>
            {reminder && (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setReminder(null);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.cardValue, !reminder && styles.cardPlaceholder]}>
            {reminder
              ? `${formatDate(formatDateTime(reminder))} at ${formatTime(formatDateTime(reminder))}`
              : 'Tap to set reminder'}
          </Text>
        </TouchableOpacity>

        {/* Date/Time Pickers */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cancelButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  saveButton: {
    padding: 4,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskNameInput: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  cardValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  cardPlaceholder: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});