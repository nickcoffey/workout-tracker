import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { exerciseFilterOptions, exerciseMetadataSummary, filterExercises } from '../../src/data/exerciseCatalog';
import { ExerciseProgress, SetEntry, WorkoutDetail, WorkoutExerciseWithSets } from '../../src/data/types';
import { EmptyState, AppButton, FilterChip, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function LogScreen() {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDetail | null>(null);
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExercisePickerVisible, setIsExercisePickerVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);

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
    setIsExercisePickerVisible(false);
  }

  async function handleFinishWorkout() {
    if (!activeWorkout) {
      return;
    }

    await finishWorkout(activeWorkout.id);
    await load();
  }

  const activeExerciseIds = new Set(activeWorkout?.exercises.map((exercise) => exercise.exerciseId) ?? []);
  const filteredExercises = useMemo(
    () => filterExercises(exercises, { query, muscleGroup: muscleGroupFilter, equipment: equipmentFilter }),
    [equipmentFilter, exercises, muscleGroupFilter, query],
  );
  const filterOptions = useMemo(() => exerciseFilterOptions(exercises), [exercises]);
  const hasActiveFilters = Boolean(query.trim() || muscleGroupFilter || equipmentFilter);

  function clearFilters() {
    setQuery('');
    setMuscleGroupFilter(null);
    setEquipmentFilter(null);
  }

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
                <View style={styles.workoutHeaderRow}>
                  <View>
                    <Text style={styles.cardTitle}>Workout in progress</Text>
                    <Text style={sharedStyles.small}>Started {new Date(activeWorkout.startedAt).toLocaleString()}</Text>
                  </View>
                  <AppButton label="Finish" onPress={handleFinishWorkout} />
                </View>
              </View>
            )}

            {activeWorkout ? (
              <View style={sharedStyles.card}>
                <View style={styles.workoutHeaderRow}>
                  <View style={styles.copy}>
                    <Text style={styles.cardTitle}>Exercises</Text>
                    <Text style={sharedStyles.small}>
                      {activeWorkout.exercises.length === 0
                        ? 'Add your first exercise to start logging sets.'
                        : `${activeWorkout.exercises.length} in this workout`}
                    </Text>
                  </View>
                  <AppButton label="Add Exercise" onPress={() => setIsExercisePickerVisible(true)} disabled={loading} />
                </View>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          activeWorkout ? (
            <View style={sharedStyles.card}>
              <Text style={styles.cardTitle}>No exercises yet</Text>
              <Text style={sharedStyles.small}>Add an exercise and your set logging controls will appear here.</Text>
              <AppButton label="Add First Exercise" onPress={() => setIsExercisePickerVisible(true)} disabled={loading} />
            </View>
          ) : null
        }
        renderItem={({ item }) => <ActiveExerciseCard exercise={item} onChanged={load} />}
      />
      <ExercisePickerModal
        activeExerciseIds={activeExerciseIds}
        equipmentFilter={equipmentFilter}
        exercises={exercises}
        filterOptions={filterOptions}
        filteredExercises={filteredExercises}
        hasActiveFilters={hasActiveFilters}
        muscleGroupFilter={muscleGroupFilter}
        onClearFilters={clearFilters}
        onClose={() => setIsExercisePickerVisible(false)}
        onSelectExercise={handleAddExercise}
        query={query}
        setEquipmentFilter={setEquipmentFilter}
        setMuscleGroupFilter={setMuscleGroupFilter}
        setQuery={setQuery}
        visible={Boolean(activeWorkout && isExercisePickerVisible)}
      />
    </Screen>
  );
}

type ExercisePickerModalProps = {
  activeExerciseIds: Set<number>;
  equipmentFilter: string | null;
  exercises: ExerciseProgress[];
  filterOptions: { muscleGroups: string[]; equipment: string[] };
  filteredExercises: ExerciseProgress[];
  hasActiveFilters: boolean;
  muscleGroupFilter: string | null;
  onClearFilters: () => void;
  onClose: () => void;
  onSelectExercise: (exerciseId: number) => void;
  query: string;
  setEquipmentFilter: (filter: string | null) => void;
  setMuscleGroupFilter: (filter: string | null) => void;
  setQuery: (query: string) => void;
  visible: boolean;
};

function ExercisePickerModal({
  activeExerciseIds,
  equipmentFilter,
  exercises,
  filterOptions,
  filteredExercises,
  hasActiveFilters,
  muscleGroupFilter,
  onClearFilters,
  onClose,
  onSelectExercise,
  query,
  setEquipmentFilter,
  setMuscleGroupFilter,
  setQuery,
  visible,
}: ExercisePickerModalProps) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet" visible={visible}>
      <View style={styles.modalRoot}>
        <View style={styles.modalHeader}>
          <View style={styles.copy}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <Text style={sharedStyles.small}>Search your catalog and tap an exercise to add it.</Text>
          </View>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onClose}>
            <Text style={styles.linkText}>Close</Text>
          </Pressable>
        </View>

        {exercises.length === 0 ? (
          <EmptyState title="No exercises yet" body="Starter exercises will appear after the catalog initializes." />
        ) : (
          <ScrollView contentContainerStyle={styles.pickerScrollContent} keyboardShouldPersistTaps="handled">
            <View style={sharedStyles.row}>
              <Text style={styles.cardTitle}>Choose Exercise</Text>
              {hasActiveFilters ? (
                <Pressable accessibilityRole="button" hitSlop={8} onPress={onClearFilters}>
                  <Text style={styles.linkText}>Clear</Text>
                </Pressable>
              ) : null}
            </View>
            <TextInput onChangeText={setQuery} placeholder="Search exercises" style={sharedStyles.input} value={query} />
            <View style={styles.filterGroup}>
              <Text style={sharedStyles.label}>Muscle</Text>
              <View style={styles.filterChips}>
                <FilterChip label="All" selected={!muscleGroupFilter} onPress={() => setMuscleGroupFilter(null)} />
                {filterOptions.muscleGroups.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    selected={muscleGroupFilter === option}
                    onPress={() => setMuscleGroupFilter(option)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.filterGroup}>
              <Text style={sharedStyles.label}>Equipment</Text>
              <View style={styles.filterChips}>
                <FilterChip label="All" selected={!equipmentFilter} onPress={() => setEquipmentFilter(null)} />
                {filterOptions.equipment.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    selected={equipmentFilter === option}
                    onPress={() => setEquipmentFilter(option)}
                  />
                ))}
              </View>
            </View>
            {filteredExercises.length === 0 ? (
              <Text style={sharedStyles.small}>No matching exercises. Adjust the search or filters.</Text>
            ) : (
              <View style={styles.exercisePicker}>
                {filteredExercises.map((exercise) => {
                  const alreadyAdded = activeExerciseIds.has(exercise.id);

                  return (
                    <Pressable
                      accessibilityRole="button"
                      disabled={alreadyAdded}
                      key={exercise.id}
                      onPress={() => onSelectExercise(exercise.id)}
                      style={({ pressed }) => [
                        styles.exerciseChip,
                        alreadyAdded && styles.exerciseChipSelected,
                        alreadyAdded && styles.exerciseChipDisabled,
                        pressed && !alreadyAdded && styles.pressed,
                      ]}
                    >
                      <Text style={styles.exerciseChipText}>{exercise.name}</Text>
                      <Text style={styles.exerciseChipMeta}>
                        {alreadyAdded ? 'Already added' : exerciseMetadataSummary(exercise)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

function ActiveExerciseCard({ exercise, onChanged }: { exercise: WorkoutExerciseWithSets; onChanged: () => Promise<void> }) {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  function resetForm() {
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

    await addSetEntry(exercise.id, parsedReps, parsedWeight, notes);

    Keyboard.dismiss();
    resetForm();
    await onChanged();
  }

  async function repeatLatestSet() {
    const latestSet = exercise.sets.at(-1);

    if (!latestSet) {
      return;
    }

    await addSetEntry(exercise.id, latestSet.reps, latestSet.weight, latestSet.notes ?? undefined);
    await onChanged();
  }

  async function removeSet(set: SetEntry) {
    await deleteSetEntry(set.id, exercise.id);
    await onChanged();
  }

  return (
    <View style={sharedStyles.card}>
      <View style={styles.exerciseCardHeader}>
        <View style={styles.copy}>
          <Text style={styles.cardTitle}>{exercise.exerciseName}</Text>
          <Text style={sharedStyles.small}>
            {exercise.sets.length === 0 ? 'No sets logged for this exercise yet.' : `${exercise.sets.length} sets logged`}
          </Text>
        </View>
        {exercise.sets.length > 0 ? <AppButton label="Repeat" onPress={repeatLatestSet} variant="secondary" /> : null}
      </View>

      {exercise.sets.map((set) => (
        <EditableSetRow key={set.id} onChanged={onChanged} onDelete={() => removeSet(set)} set={set} />
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
        <AppButton label="Add Set" onPress={saveSet} />
      </View>
    </View>
  );
}

function EditableSetRow({ set, onChanged, onDelete }: { set: SetEntry; onChanged: () => Promise<void>; onDelete: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editReps, setEditReps] = useState(String(set.reps));
  const [editWeight, setEditWeight] = useState(String(set.weight));
  const [editNotes, setEditNotes] = useState(set.notes ?? '');

  function beginEdit() {
    setEditReps(String(set.reps));
    setEditWeight(String(set.weight));
    setEditNotes(set.notes ?? '');
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditReps(String(set.reps));
    setEditWeight(String(set.weight));
    setEditNotes(set.notes ?? '');
    setIsEditing(false);
  }

  async function saveEdit() {
    const parsedReps = Number.parseInt(editReps, 10);
    const parsedWeight = Number.parseFloat(editWeight);

    if (!Number.isFinite(parsedReps) || parsedReps <= 0 || !Number.isFinite(parsedWeight) || parsedWeight < 0) {
      Alert.alert('Check the set', 'Reps must be greater than 0 and weight must be 0 or higher.');
      return;
    }

    await updateSetEntry(set.id, parsedReps, parsedWeight, editNotes);
    Keyboard.dismiss();
    setIsEditing(false);
    await onChanged();
  }

  return (
    <View style={styles.setRow}>
      {isEditing ? (
        <View style={styles.inlineEditStack}>
          <Text style={styles.setText}>Set {set.setNumber}</Text>
          <View style={styles.setForm}>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setEditReps}
              placeholder="Reps"
              style={[sharedStyles.input, styles.compactInput]}
              value={editReps}
            />
            <TextInput
              keyboardType="decimal-pad"
              onChangeText={setEditWeight}
              placeholder="Weight"
              style={[sharedStyles.input, styles.compactInput]}
              value={editWeight}
            />
          </View>
          <TextInput onChangeText={setEditNotes} placeholder="Notes (optional)" style={sharedStyles.input} value={editNotes} />
          <View style={styles.formActions}>
            <AppButton label="Cancel" onPress={cancelEdit} variant="secondary" />
            <AppButton label="Save" onPress={saveEdit} />
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.setText}>
            Set {set.setNumber}: {set.reps} reps at {set.weight} lb
          </Text>
          {set.notes ? <Text style={sharedStyles.small}>{set.notes}</Text> : null}
          <View style={styles.setActions}>
            <Pressable accessibilityRole="button" onPress={beginEdit} hitSlop={8}>
              <Text style={styles.linkText}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onDelete} hitSlop={8}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerStack: {
    gap: spacing.md,
  },
  workoutHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
  },
  modalRoot: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  exercisePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pickerScrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  filterGroup: {
    gap: spacing.xs,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  exerciseChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    maxWidth: '100%',
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
  exerciseChipMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
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
  exerciseCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
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
  inlineEditStack: {
    gap: spacing.sm,
  },
  formActions: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
});
