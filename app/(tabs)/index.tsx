import { useCallback, useState } from 'react';
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  addExerciseToWorkout,
  addSetEntry,
  deleteSetEntry,
  finishWorkout,
  getActiveWorkout,
  initializeDatabase,
  listExercisesWithProgress,
  startWorkout,
  updateSetEntry,
} from '../../src/data/repository';
import { ExerciseProgress, SetEntry, WorkoutDetail, WorkoutExerciseWithSets } from '../../src/data/types';
import { EmptyState, AppButton, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function LogScreen() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDetail | null>(null);
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    await initializeDatabase();
    const [nextExercises, workout] = await Promise.all([listExercisesWithProgress(), getActiveWorkout()]);
    setExercises(nextExercises);
    setActiveWorkout(workout);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function handleStartWorkout() {
    await startWorkout();
    await load();
  }

  async function handleAddExercise(exerciseId: number) {
    if (!activeWorkout) {
      return;
    }

    await addExerciseToWorkout(activeWorkout.id, exerciseId);
    await load();
  }

  async function handleFinishWorkout() {
    if (!activeWorkout) {
      return;
    }

    await finishWorkout(activeWorkout.id);
    await load();
  }

  const activeExerciseIds = new Set(activeWorkout?.exercises.map((exercise) => exercise.exerciseId) ?? []);

  return (
    <Screen title="Log" subtitle="Track today's workout as you go.">
      <FlatList
        contentContainerStyle={sharedStyles.listContent}
        data={activeWorkout?.exercises ?? []}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            {!activeWorkout ? (
              <View style={sharedStyles.card}>
                <Text style={styles.cardTitle}>Ready to train?</Text>
                <Text style={sharedStyles.small}>Start a workout, add exercises, then log sets with reps and weight.</Text>
                <AppButton label="Start Workout" onPress={handleStartWorkout} disabled={loading} />
              </View>
            ) : (
              <View style={sharedStyles.card}>
                <View style={sharedStyles.row}>
                  <View>
                    <Text style={styles.cardTitle}>Workout in progress</Text>
                    <Text style={sharedStyles.small}>Started {new Date(activeWorkout.startedAt).toLocaleString()}</Text>
                  </View>
                  <AppButton label="Finish" onPress={handleFinishWorkout} />
                </View>
              </View>
            )}

            <View style={sharedStyles.card}>
              <Text style={styles.cardTitle}>Add Exercise</Text>
              {exercises.length === 0 ? (
                <Text style={sharedStyles.small}>Create exercises from the Exercises tab before logging sets.</Text>
              ) : (
                <View style={styles.exercisePicker}>
                  {exercises.map((exercise) => (
                    <Pressable
                      accessibilityRole="button"
                      disabled={!activeWorkout || activeExerciseIds.has(exercise.id)}
                      key={exercise.id}
                      onPress={() => handleAddExercise(exercise.id)}
                      style={({ pressed }) => [
                        styles.exerciseChip,
                        activeExerciseIds.has(exercise.id) && styles.exerciseChipSelected,
                        (!activeWorkout || activeExerciseIds.has(exercise.id)) && styles.exerciseChipDisabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.exerciseChipText}>{exercise.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          activeWorkout ? (
            <EmptyState title="No exercises yet" body="Choose an exercise above to start logging sets." />
          ) : null
        }
        renderItem={({ item }) => <ActiveExerciseCard exercise={item} onChanged={load} />}
      />
    </Screen>
  );
}

function ActiveExerciseCard({ exercise, onChanged }: { exercise: WorkoutExerciseWithSets; onChanged: () => Promise<void> }) {
  const [editingSet, setEditingSet] = useState<SetEntry | null>(null);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  function beginEdit(set: SetEntry) {
    setEditingSet(set);
    setReps(String(set.reps));
    setWeight(String(set.weight));
    setNotes(set.notes ?? '');
  }

  function resetForm() {
    setEditingSet(null);
    setReps('');
    setWeight('');
    setNotes('');
  }

  async function saveSet() {
    const parsedReps = Number.parseInt(reps, 10);
    const parsedWeight = Number.parseFloat(weight);

    if (!Number.isFinite(parsedReps) || parsedReps <= 0 || !Number.isFinite(parsedWeight) || parsedWeight < 0) {
      Alert.alert('Check the set', 'Reps must be greater than 0 and weight must be 0 or higher.');
      return;
    }

    if (editingSet) {
      await updateSetEntry(editingSet.id, parsedReps, parsedWeight, notes);
    } else {
      await addSetEntry(exercise.id, parsedReps, parsedWeight, notes);
    }

    Keyboard.dismiss();
    resetForm();
    await onChanged();
  }

  async function removeSet(set: SetEntry) {
    await deleteSetEntry(set.id, exercise.id);
    await onChanged();
  }

  return (
    <View style={sharedStyles.card}>
      <Text style={styles.cardTitle}>{exercise.exerciseName}</Text>

      {exercise.sets.length === 0 ? <Text style={sharedStyles.small}>No sets logged for this exercise yet.</Text> : null}

      {exercise.sets.map((set) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setText}>
            Set {set.setNumber}: {set.reps} reps at {set.weight} lb
          </Text>
          <View style={styles.setActions}>
            <Pressable onPress={() => beginEdit(set)} hitSlop={8}>
              <Text style={styles.linkText}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => removeSet(set)} hitSlop={8}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.setForm}>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setReps}
          placeholder="Reps"
          style={[sharedStyles.input, styles.compactInput]}
          value={reps}
        />
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setWeight}
          placeholder="Weight"
          style={[sharedStyles.input, styles.compactInput]}
          value={weight}
        />
      </View>
      <TextInput onChangeText={setNotes} placeholder="Notes (optional)" style={sharedStyles.input} value={notes} />
      <View style={styles.formActions}>
        {editingSet ? <AppButton label="Cancel" onPress={resetForm} variant="secondary" /> : null}
        <AppButton label={editingSet ? 'Save Set' : 'Add Set'} onPress={saveSet} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerStack: {
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  exercisePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  exerciseChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  exerciseChipSelected: {
    backgroundColor: colors.primary,
  },
  exerciseChipDisabled: {
    opacity: 0.45,
  },
  exerciseChipText: {
    color: colors.text,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  setRow: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  setText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  setActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '700',
  },
  setForm: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  compactInput: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
});
