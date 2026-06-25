import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import { getWorkoutDetail, initializeDatabase } from '../../src/data/repository';
import { summarizeWorkout } from '../../src/data/progress';
import { WorkoutDetail, WorkoutExerciseWithSets } from '../../src/data/types';
import { EmptyState, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);

  const load = useCallback(async () => {
    await initializeDatabase();
    const parsedId = Number.parseInt(id ?? '', 10);
    setWorkout(Number.isFinite(parsedId) ? await getWorkoutDetail(parsedId) : null);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const stats = workout ? summarizeWorkout(workout.exercises) : null;

  return (
    <Screen title="Workout" subtitle={workout ? new Date(workout.startedAt).toLocaleString() : 'Workout details'}>
      <FlatList
        contentContainerStyle={sharedStyles.listContent}
        data={workout?.exercises ?? []}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          workout && stats ? (
            <View style={sharedStyles.card}>
              <Text style={styles.cardTitle}>Summary</Text>
              <Text style={sharedStyles.body}>{stats.setCount} sets</Text>
              <Text style={sharedStyles.small}>Total volume: {stats.totalVolume.toLocaleString()} lb</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={<EmptyState title="Workout not found" body="This workout may have been deleted or has no logged exercises." />}
        renderItem={({ item }) => <WorkoutExerciseCard exercise={item} />}
      />
    </Screen>
  );
}

function WorkoutExerciseCard({ exercise }: { exercise: WorkoutExerciseWithSets }) {
  return (
    <View style={sharedStyles.card}>
      <Text style={styles.cardTitle}>{exercise.exerciseName}</Text>
      {exercise.sets.length === 0 ? <Text style={sharedStyles.small}>No sets logged.</Text> : null}
      {exercise.sets.map((set) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={sharedStyles.body}>
            Set {set.setNumber}: {set.reps} reps at {set.weight} lb
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  setRow: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
});
