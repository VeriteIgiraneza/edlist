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
    marginBottom: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});