import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../../types';
import { COLORS } from '../../constants/colors';

interface TaskWithTime extends Task {
  sessionMinutes?: number;
  startTime?: Date;
  endTime?: Date;
  selected: boolean;
}

interface Props {
  task: TaskWithTime;
  folderName: string;
  folderColor: string;
  formatDueDate: (dateString: string) => string;
  onToggleSelection: (taskId: number) => void;
  onUpdateStartTime: (taskId: number, time: Date) => void;
  onUpdateEndTime: (taskId: number, time: Date) => void;
}

const formatTimeDisplay = (date?: Date): string => {
  if (!date) return '--:--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TimeRangePicker: React.FC<{
  taskId: number;
  startTime?: Date;
  endTime?: Date;
  sessionMinutes?: number;
  onUpdateStartTime: (taskId: number, time: Date) => void;
  onUpdateEndTime: (taskId: number, time: Date) => void;
}> = ({ taskId, startTime, endTime, sessionMinutes, onUpdateStartTime, onUpdateEndTime }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartChange = (_: any, selectedTime?: Date) => {
    setShowStartPicker(false);
    if (selectedTime) {
      onUpdateStartTime(taskId, selectedTime);
    }
  };

  const handleEndChange = (_: any, selectedTime?: Date) => {
    setShowEndPicker(false);
    if (selectedTime) {
      onUpdateEndTime(taskId, selectedTime);
    }
  };

  return (
    <View style={styles.timeInputSection}>
      <View style={styles.timeRangeRow}>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowStartPicker(true)}
        >
          <MaterialCommunityIcons name="clock-start" size={18} color={COLORS.primary} />
          <Text style={styles.timePickerLabel}>Start</Text>
          <Text style={styles.timePickerValue}>{formatTimeDisplay(startTime)}</Text>
        </TouchableOpacity>

        <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.textMuted} />

        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowEndPicker(true)}
        >
          <MaterialCommunityIcons name="clock-end" size={18} color={COLORS.primary} />
          <Text style={styles.timePickerLabel}>End</Text>
          <Text style={styles.timePickerValue}>{formatTimeDisplay(endTime)}</Text>
        </TouchableOpacity>
      </View>

      {sessionMinutes != null && sessionMinutes > 0 && (
        <Text style={styles.durationText}>{sessionMinutes} min session</Text>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startTime || new Date()}
          mode="time"
          display="default"
          onChange={handleStartChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime || new Date()}
          mode="time"
          display="default"
          onChange={handleEndChange}
        />
      )}
    </View>
  );
};

export const FocusTaskItem: React.FC<Props> = ({
  task,
  folderName,
  folderColor,
  formatDueDate,
  onToggleSelection,
  onUpdateStartTime,
  onUpdateEndTime,
}) => {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskLeft}
        onPress={() => onToggleSelection(task.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={task.selected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={24}
          color={task.selected ? COLORS.primary : COLORS.textSecondary}
        />
        <View style={styles.taskInfo}>
          <MarqueeTaskName name={task.name} selected={task.selected} />
          <View style={styles.taskMetaRow}>
            <View style={[styles.folderDot, { backgroundColor: folderColor }]} />
            <Text style={styles.taskFolder}>{folderName}</Text>
            {task.dueDate && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.taskDue}>{formatDueDate(task.dueDate)}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {task.selected && (
        <TimeRangePicker
          taskId={task.id}
          startTime={task.startTime}
          endTime={task.endTime}
          sessionMinutes={task.sessionMinutes}
          onUpdateStartTime={onUpdateStartTime}
          onUpdateEndTime={onUpdateEndTime}
        />
      )}
    </View>
  );
};

const MarqueeTaskName: React.FC<{ name: string; selected: boolean }> = ({ name, selected }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (textWidth > containerWidth && containerWidth > 0 && textWidth > 0) {
      const timer = setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollAnim, {
              toValue: -(textWidth - containerWidth + 20),
              duration: (textWidth / 100) * 1000,
              useNativeDriver: true,
            }),
            Animated.delay(500),
            Animated.timing(scrollAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(1000),
          ])
        ).start();
      }, 200);

      return () => {
        clearTimeout(timer);
        scrollAnim.setValue(0);
      };
    } else {
      scrollAnim.setValue(0);
    }
  }, [textWidth, containerWidth]);

  return (
    <View
      style={{ overflow: 'hidden', width: '100%' }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text
        style={[
          styles.taskName,
          selected && styles.taskNameSelected,
          {
            transform: [{ translateX: scrollAnim }],
            ...(textWidth > containerWidth ? { width: textWidth + 20 } : {}),
          },
        ]}
        // numberOfLines={1}
        onTextLayout={(e) => {
          if (e.nativeEvent?.lines?.length > 0) {
            let totalWidth = 0;
            for (const line of e.nativeEvent.lines) {
              if (line && line.width) {
                totalWidth += line.width;
              }
            }
            if (totalWidth > 0) {
              setTextWidth(Math.ceil(totalWidth));
            }
          }
        }}
      >
        {name}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    flexWrap: 'nowrap',
    maxHeight: 22,
  },
  taskNameSelected: {
    color: COLORS.primary,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  folderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskFolder: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  separator: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  taskDue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeInputSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
  },
  timeRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  timePickerButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  timePickerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  timePickerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  durationText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});