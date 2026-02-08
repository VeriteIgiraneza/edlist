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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Task } from '../types';
import { useTasks } from '../contexts/TaskContext';
import { SwipeableTask } from '../components/SwipeableTask';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tasks'>;
type TasksScreenRouteProp = RouteProp<RootStackParamList, 'Tasks'>;

interface Props {
  navigation: TasksScreenNavigationProp;
  route: TasksScreenRouteProp;
}

export const TasksScreen: React.FC<Props> = ({ navigation, route }) => {
  const { folderId, folderName } = route.params;
  const { getTasksByFolder, deleteTask, toggleTaskCompletion } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const folderTasks = await getTasksByFolder(folderId);
      setTasks(folderTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [folderId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = (task: Task) => {
    Alert.alert(
      'Delete Assignment',
      `Are you sure you want to delete "${task.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            loadTasks();
          },
        },
      ]
    );
  };

  const handleComplete = async (task: Task) => {
    await toggleTaskCompletion(task);
    loadTasks();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderName}</Text>
      
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={COLORS.textSecondary}
          style={styles.headerIcon}
        />
        <Text style={styles.header}>Assignments Due Soon</Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No assignments yet</Text>
          <Text style={styles.emptySubtext}>Tap "New List" to add one</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SwipeableTask
              task={item}
              onPress={() => navigation.navigate('EditTask', { task: item })}
              onDelete={() => handleDelete(item)}
              onComplete={() => handleComplete(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('NewTask', { folderId })}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>New List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    marginRight: 4,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  listContainer: {
    paddingBottom: 80,
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
  newButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});