import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { FOLDER_COLORS } from '../constants/colors';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorSelect }) => {
  return (
    <View style={styles.container}>
      {FOLDER_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onColorSelect(color)}
          activeOpacity={0.7}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 16,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: '#000',
  },
});