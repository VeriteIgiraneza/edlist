import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Folder } from '../types';
import { COLORS } from '../constants/colors';

interface FolderCardProps {
  folder: Folder;
  onPress: () => void;
  onLongPress?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorStripe, { backgroundColor: folder.color }]} />
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="folder"
          size={36}
          color={folder.color}
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
  colorStripe: {
    width: 10,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
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