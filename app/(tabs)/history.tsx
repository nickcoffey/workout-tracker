import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { getWorkoutHistory, initializeDatabase } from '../../src/data/repository';
import { WorkoutSummary } from '../../src/data/types';
import { formatWeight } from '../../src/data/progress';
import { EmptyState, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);

  const load = useCallback(async () => {
    await initializeDatabase();
    setWorkouts(await getWorkoutHistory());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Screen title="History" subtitle="Completed workouts and training volume.">
      <FlatList
        contentContainerStyle={sharedStyles.listContent}
        data={workouts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<EmptyState title="No completed workouts" body="Finish a workout from the Log tab and it will appear here." />}
        renderItem={({ item }) => <WorkoutHistoryCard workout={item} />}
      />
    </Screen>
  );
}

function WorkoutHistoryCard({ workout }: { workout: WorkoutSummary }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/workout/[id]', params: { id: String(workout.id) } })}
      style={({ pressed }) => [sharedStyles.card, pressed && styles.pressed]}
    >
      <View style={sharedStyles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>{new Date(workout.startedAt).toLocaleDateString()}</Text>
          <Text style={sharedStyles.small}>
            {workout.exerciseCount} exercises · {workout.setCount} sets
          </Text>
        </View>
        <Text style={styles.volume}>{formatWeight(workout.totalVolume)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  volume: {
    color: colors.primary,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
