import React, { useState, useEffect } from 'react';
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
import { RootStackParamList } from '../types';
import { useFolders } from '../contexts/FolderContext';
import { ColorPicker } from '../components/ColorPicker';
import { COLORS, FOLDER_COLORS } from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NewFolderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewFolder'>;

interface Props {
  navigation: NewFolderScreenNavigationProp;
}

export const NewFolderScreen: React.FC<Props> = ({ navigation }) => {
  const { createFolder } = useFolders();
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      if (!folderName.trim()) {
        // If no folder name, just let them go back
        return;
      }

      // Prevent default back action
      e.preventDefault();

      // Save the folder
      try {
        await createFolder({
          name: folderName.trim(),
          color: selectedColor,
        });
        // After saving, allow navigation
        navigation.dispatch(e.data.action);
      } catch (error) {
        Alert.alert('Error', 'Failed to create folder');
      }
    });

    return unsubscribe;
  }, [navigation, folderName, selectedColor, createFolder]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="close" size={28} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Folder</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <MaterialCommunityIcons name="check" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View> */}

        {/* Folder Preview Card */}
        <View style={styles.previewCard}>
          <View style={[styles.previewColorStripe, { backgroundColor: selectedColor }]} />
          <View style={styles.previewContent}>
            <MaterialCommunityIcons
              name="folder"
              size={48}
              color={selectedColor}
              style={styles.previewIcon}
            />
            <Text style={styles.previewText}>
              {folderName.trim() || 'Folder Preview'}
            </Text>
          </View>
        </View>

        {/* Folder Name Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Folder Name</Text>
          <TextInput
            style={styles.folderNameInput}
            placeholder="e.g., Work, Personal, Study..."
            placeholderTextColor={COLORS.textMuted}
            value={folderName}
            onChangeText={setFolderName}
            autoFocus
          />
        </View>

        {/* Color Picker Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Folder Color</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker 
              selectedColor={selectedColor} 
              onColorSelect={setSelectedColor} 
            />
          </View>
        </View>
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
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
  previewCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginHorizontal: 2,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  previewColorStripe: {
    width: '100%',
    height: 4,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  previewIcon: {
    marginRight: 16,
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 2,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  folderNameInput: {
    fontSize: 18,
    color: COLORS.textPrimary,
    paddingVertical: 8,
  },
  colorPickerContainer: {
    marginTop: 8,
  },
});