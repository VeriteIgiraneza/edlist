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
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AllTasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AllTasks'>;

interface Props {
  navigation: AllTasksScreenNavigationProp;
}

export const AllTasksScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, deleteTask, toggleTaskCompletion, loading } = useTasks();
  const { folders } = useFolders();

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

    // Create alert buttons for each folder
    const folderButtons = folders.map(folder => ({
        text: folder.name,
        onPress: () => navigation.navigate('NewTask', { folderId: folder.id }),
    }));

    // Add cancel button
    folderButtons.push({ text: 'Cancel', style: 'cancel' } as any);

    Alert.alert(
        'Select Folder',
        'Which folder should this task be added to?',
        folderButtons
    );
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
      <View style={styles.titleContainer}>
        <TouchableOpacity
            style={styles.topAddButton}
            onPress={handleAddTask}
            activeOpacity={0.8}
        >
            <MaterialCommunityIcons name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>All Tasks</Text>
        
        <TouchableOpacity
            style={styles.topFoldersButton}
            onPress={() => navigation.navigate('Folders')}
            activeOpacity={0.8}
        >
            <MaterialCommunityIcons name="folder-multiple" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={20}
          color={COLORS.textSecondary}
          style={styles.headerIcon}
        />
        <Text style={styles.header}>Tasks Due Soon</Text>
      </View> */}

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
  },
  topAddButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
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
    flex: 1,
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
});