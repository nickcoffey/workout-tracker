import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  createExercise,
  deleteExercise,
  initializeDatabase,
  listExercisesWithProgress,
  updateExercise,
} from '../../src/data/repository';
import { exerciseFilterOptions, exerciseMetadataSummary, filterExercises } from '../../src/data/exerciseCatalog';
import { ExerciseProgress } from '../../src/data/types';
import { formatWeight } from '../../src/data/progress';
import { EmptyState, AppButton, FilterChip, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [editingExercise, setEditingExercise] = useState<ExerciseProgress | null>(null);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [query, setQuery] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>(null);

  const load = useCallback(async () => {
    await initializeDatabase();
    setExercises(await listExercisesWithProgress());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function resetForm() {
    setEditingExercise(null);
    setName('');
    setMuscleGroup('');
    setEquipment('');
  }

  function beginEdit(exercise: ExerciseProgress) {
    setEditingExercise(exercise);
    setName(exercise.name);
    setMuscleGroup(exercise.muscleGroup ?? '');
    setEquipment(exercise.equipment ?? '');
  }

  const filteredExercises = useMemo(
    () => filterExercises(exercises, { query, muscleGroup: muscleGroupFilter, equipment: equipmentFilter }),
    [equipmentFilter, exercises, muscleGroupFilter, query],
  );
  const filterOptions = useMemo(() => exerciseFilterOptions(exercises), [exercises]);
  const hasActiveFilters = Boolean(query.trim() || muscleGroupFilter || equipmentFilter);

  async function saveExercise() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Add an exercise name before saving.');
      return;
    }

    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, name, {
          category: editingExercise.category ?? undefined,
          muscleGroup,
          equipment,
        });
      } else {
        await createExercise(name, { muscleGroup, equipment });
      }

      Keyboard.dismiss();
      resetForm();
      await load();
    } catch {
      Alert.alert('Could not save exercise', 'Exercise names must be unique.');
    }
  }

  function clearFilters() {
    setQuery('');
    setMuscleGroupFilter(null);
    setEquipmentFilter(null);
  }

  async function removeExercise(exercise: ExerciseProgress) {
    try {
      await deleteExercise(exercise.id);
      if (editingExercise?.id === exercise.id) {
        resetForm();
      }
      await load();
    } catch {
      Alert.alert('Exercise is in use', 'Exercises already used in workouts stay available for workout history.');
    }
  }

  return (
    <Screen title="Exercises" subtitle="Build the catalog you use while logging.">
      <FlatList
        contentContainerStyle={sharedStyles.listContent}
        data={filteredExercises}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.headerStack}>
            <View style={sharedStyles.card}>
              <Text style={styles.cardTitle}>{editingExercise ? 'Edit Exercise' : 'New Exercise'}</Text>
              <TextInput onChangeText={setName} placeholder="Exercise name" style={sharedStyles.input} value={name} />
              <TextInput
                onChangeText={setMuscleGroup}
                placeholder="Muscle group (optional)"
                style={sharedStyles.input}
                value={muscleGroup}
              />
              <TextInput
                onChangeText={setEquipment}
                placeholder="Equipment (optional)"
                style={sharedStyles.input}
                value={equipment}
              />
              <View style={styles.formActions}>
                {editingExercise ? <AppButton label="Cancel" onPress={resetForm} variant="secondary" /> : null}
                <AppButton label={editingExercise ? 'Save Changes' : 'Add Exercise'} onPress={saveExercise} />
              </View>
            </View>

            <View style={sharedStyles.card}>
              <View style={sharedStyles.row}>
                <Text style={styles.cardTitle}>Browse Catalog</Text>
                {hasActiveFilters ? (
                  <Pressable accessibilityRole="button" hitSlop={8} onPress={clearFilters}>
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
            </View>
          </View>
        }
        ListEmptyComponent={
          hasActiveFilters ? (
            <EmptyState title="No matching exercises" body="Adjust the search or filters to find exercises in your catalog." />
          ) : (
            <EmptyState title="No exercises yet" body="Starter exercises will appear after the catalog initializes." />
          )
        }
        renderItem={({ item }) => (
          <View style={sharedStyles.card}>
            <View style={sharedStyles.row}>
              <View style={styles.copy}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={sharedStyles.small}>{exerciseMetadataSummary(item)}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable onPress={() => beginEdit(item)} hitSlop={8}>
                  <Text style={styles.linkText}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => removeExercise(item)} hitSlop={8}>
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
            <Text style={sharedStyles.small}>
              {item.totalSets} sets · Best {item.bestWeight === null ? 'n/a' : formatWeight(item.bestWeight)}
            </Text>
            <Text style={sharedStyles.small}>
              Last logged {item.lastLoggedAt ? new Date(item.lastLoggedAt).toLocaleDateString() : 'never'}
            </Text>
          </View>
        )}
      />
    </Screen>
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
  copy: {
    flex: 1,
  },
  actions: {
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
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  filterGroup: {
    gap: spacing.xs,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
