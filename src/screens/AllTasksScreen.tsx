import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { useFolders } from '../contexts/FolderContext';
import { SwipeableTask } from '../components/SwipeableTask';
import { COLORS } from '../constants/colors';
import { FolderSelectorModal } from '../components/FolderSelectorModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TimerModal } from '../components/TimerModal';
import { ActiveTimerBar } from '../components/ActiveTimerBar';

type AllTasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AllTasks'>;

interface Props {
  navigation: AllTasksScreenNavigationProp;
}

export const AllTasksScreen: React.FC<Props> = ({ navigation }) => {
const { tasks, deleteTask, toggleTaskCompletion, updateTask, loading } = useTasks();
  const { folders } = useFolders();
  const [showFolderSelector, setShowFolderSelector] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);
  const [lastTap, setLastTap] = useState<number | null>(null);

  useEffect(() => {
    const timerTask = tasks.find(t => t.timerActive);
    setActiveTimerTask(timerTask || null);
  }, [tasks]);

  const getFolderName = (folderId: number): string => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : 'Unknown';
  };

  const getFolderColor = (folderId: number): string => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.color : COLORS.gray;
  };

  const handleDelete = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
          },
        },
      ]
    );
  };

  const handleComplete = async (task: Task) => {
    await toggleTaskCompletion(task);
  };

  const handleAddTask = () => {
    if (folders.length === 0) {
      Alert.alert(
        'No Folders',
        'Please create a folder first before adding tasks.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowFolderSelector(true);
  };

  const handleSelectFolder = (folderId: number) => {
    setShowFolderSelector(false);
    navigation.navigate('NewTask', { folderId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handleStartTimer = async (taskId: number, minutes: number, usePomodoro: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Stop any existing timer
    const existingTimer = tasks.find(t => t.timerActive);
    if (existingTimer) {
      await updateTask({
        ...existingTimer,
        timerActive: false,
        timerStartedAt: null,
      });
    }

    // Start new timer
    await updateTask({
      ...task,
      estimatedMinutes: usePomodoro ? 25 : minutes,
      timerActive: true,
      timerStartedAt: new Date().toISOString(),
    });
  };

  const handleStopTimer = async () => {
    if (!activeTimerTask) return;

    await updateTask({
      ...activeTimerTask,
      timerActive: false,
      timerStartedAt: null,
    });
  };

  const handleCompleteTimer = async () => {
    if (!activeTimerTask) return;

    await updateTask({
      ...activeTimerTask,
      completed: true,
      timerActive: false,
      timerStartedAt: null,
    });
  };

  const handleTimerPress = (task: Task) => {
    setSelectedTask(task);
    setShowTimerModal(true);
  };

  const handleTitleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // milliseconds

    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      Alert.alert('Focus Mode', 'Opening Pomodoro Focus Mode...', [
        { text: 'OK' }
      ]);
      // navigation.navigate('FocusMode'); // Create this screen later
    } else {
      setLastTap(now);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
            style={styles.topAddButton}
            onPress={handleAddTask}
            activeOpacity={0.8}
        >
            <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleTitleDoubleTap}
          activeOpacity={0.8}
          style={{ flex: 1 }}
        > 
          <Text style={styles.title}>All Tasks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
            style={styles.topFoldersButton}
            onPress={() => navigation.navigate('Folders')}
            activeOpacity={0.8}
        >
            <MaterialCommunityIcons name="folder-multiple" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Create a folder and add tasks</Text>
        </View>
        ) : (
        <FlatList
          data={[...tasks].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          })}
          extraData={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
          <View>
            <View style={styles.folderBadge}>
              <View 
                style={[
                  styles.folderColorDot, 
                  { backgroundColor: getFolderColor(item.folderId) }
                ]} 
              />
              <Text style={styles.folderName}>{getFolderName(item.folderId)}</Text>
              
              {/* Timer Button */}
              {!item.completed && (
                <TouchableOpacity
                  onPress={() => handleTimerPress(item)}
                  style={styles.timerButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons
                    name={item.timerActive ? "timer" : "timer-outline"}
                    size={18}
                    color={item.timerActive ? COLORS.primary : COLORS.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
            <SwipeableTask
              task={item}
              onPress={() => navigation.navigate('EditTask', { task: item })}
              onDelete={() => handleDelete(item)}
              onComplete={() => handleComplete(item)}
            />
          </View>
        )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Active Timer Bar */}
      {activeTimerTask && (
        <ActiveTimerBar
          task={activeTimerTask}
          onStop={handleStopTimer}
          onComplete={handleCompleteTimer}
        />
      )}

      {/* Timer Modal */}
      <TimerModal
        visible={showTimerModal}
        task={selectedTask}
        onClose={() => setShowTimerModal(false)}
        onStartTimer={handleStartTimer}
      />

      <FolderSelectorModal
        visible={showFolderSelector}
        folders={folders}
        onSelectFolder={handleSelectFolder}
        onCancel={() => setShowFolderSelector(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 1,
    minHeight: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  topFoldersButton: {
    padding: 8,
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  topAddButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    // flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  folderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 16,
  },
  folderColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  folderName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  timerButton: {
    marginLeft: 8,
    padding: 4,
},
});