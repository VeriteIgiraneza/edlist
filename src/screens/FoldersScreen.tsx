import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
  const { folders, loading, refreshFolders } = useFolders();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Folders</Text>
      
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="folder"
          size={20}
          color={COLORS.textSecondary}
          style={styles.headerIcon}
        />
        <Text style={styles.header}>Folders</Text>
      </View>

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
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('NewFolder')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>New Folder</Text>
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