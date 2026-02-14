import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  total: number;
  selected: number;
  totalMinutes: number;
}

export const StatsCards: React.FC<Props> = ({ total, selected, totalMinutes }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{total}</Text>
        <Text style={styles.statLabel}>Total Tasks</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{selected}</Text>
        <Text style={styles.statLabel}>Selected</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{totalMinutes}</Text>
        <Text style={styles.statLabel}>Minutes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});