import React, { useEffect } from 'react';
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
import { RootStackParamList } from '../types';
import { useFolders } from '../contexts/FolderContext';
import { FolderCard } from '../components/FolderCard';
import { COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FoldersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Folders'>;

interface Props {
  navigation: FoldersScreenNavigationProp;
}

export const FoldersScreen: React.FC<Props> = ({ navigation }) => {
  const { folders, loading, refreshFolders, deleteFolder } = useFolders();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshFolders();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const handleDeleteFolder = (folder: { id: number; name: string }) => {
    Alert.alert(
      'Delete Folder',
      `Are you sure you want to delete "${folder.name}"? This will also delete all tasks inside.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteFolder(folder.id);
            refreshFolders();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Folders</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NewFolder')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="plus-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Folder Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
        </Text>
      </View>

      {/* Folder List */}
      {folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="folder-outline" 
            size={80} 
            color={COLORS.textMuted} 
          />
          <Text style={styles.emptyText}>No folders yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to create your first folder</Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FolderCard
              folder={item}
              onPress={() => navigation.navigate('Tasks', {
                folderId: item.id,
                folderName: item.name,
              })}
              onLongPress={() => handleDeleteFolder(item)}
            />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 4,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  countText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});