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

  const handleSave = async () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      await createFolder({
        name: folderName.trim(),
        color: selectedColor,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create folder');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>New Folder</Text>

        <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="folder"
            size={24}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Folder Name"
            placeholderTextColor={COLORS.textMuted}
            value={folderName}
            onChangeText={setFolderName}
            autoFocus
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Folder Color</Text>
        <ColorPicker selectedColor={selectedColor} onColorSelect={setSelectedColor} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: COLORS.gray,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  doneButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.textMuted,
    marginLeft: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 24,
    marginBottom: 8,
  },
});