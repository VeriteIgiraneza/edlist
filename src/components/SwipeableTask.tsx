import React, { useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { COLORS } from '../constants/colors';

interface SwipeableTaskProps {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

export const SwipeableTask: React.FC<SwipeableTaskProps> = ({
  task,
  onPress,
  onDelete,
  onComplete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActionsContainer}>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <RectButton
            style={styles.deleteButton}
            onPress={() => {
              swipeableRef.current?.close();
              onDelete();
            }}
          >
            <MaterialCommunityIcons name="delete" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionText}>Delete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.leftActionsContainer}>
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <RectButton
            style={styles.completeButton}
            onPress={() => {
              swipeableRef.current?.close();
              onComplete();
            }}
          >
            <MaterialCommunityIcons name="check" size={24} color={COLORS.textPrimary} />
            <Text style={styles.actionText}>Complete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <TaskCard task={task} onPress={onPress} />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  completeButton: {
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});