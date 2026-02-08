import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Folder } from '../types';
import { COLORS } from '../constants/colors';

interface FolderCardProps {
  folder: Folder;
  onPress: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="folder"
          size={36}
          color={COLORS.textPrimary}
          style={styles.icon}
        />
        <Text style={styles.folderName}>{folder.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.folderCard,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 8,
  },
  folderName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});