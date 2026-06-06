import { useCallback, useState } from 'react';
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  createExercise,
  deleteExercise,
  initializeDatabase,
  listExercisesWithProgress,
  updateExercise,
} from '../../src/data/repository';
import { ExerciseProgress } from '../../src/data/types';
import { formatWeight } from '../../src/data/progress';
import { EmptyState, AppButton, Screen, sharedStyles } from '../../src/ui/components';
import { colors, spacing } from '../../src/ui/theme';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<ExerciseProgress[]>([]);
  const [editingExercise, setEditingExercise] = useState<ExerciseProgress | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

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
    setCategory('');
  }

  function beginEdit(exercise: ExerciseProgress) {
    setEditingExercise(exercise);
    setName(exercise.name);
    setCategory(exercise.category ?? '');
  }

  async function saveExercise() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Add an exercise name before saving.');
      return;
    }

    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, name, category);
      } else {
        await createExercise(name, category);
      }

      Keyboard.dismiss();
      resetForm();
      await load();
    } catch {
      Alert.alert('Could not save exercise', 'Exercise names must be unique.');
    }
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
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={sharedStyles.card}>
            <Text style={styles.cardTitle}>{editingExercise ? 'Edit Exercise' : 'New Exercise'}</Text>
            <TextInput onChangeText={setName} placeholder="Exercise name" style={sharedStyles.input} value={name} />
            <TextInput onChangeText={setCategory} placeholder="Category (optional)" style={sharedStyles.input} value={category} />
            <View style={styles.formActions}>
              {editingExercise ? <AppButton label="Cancel" onPress={resetForm} variant="secondary" /> : null}
              <AppButton label={editingExercise ? 'Save Changes' : 'Add Exercise'} onPress={saveExercise} />
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState title="No exercises yet" body="Add your first exercise to make it available in the Log tab." />}
        renderItem={({ item }) => (
          <View style={sharedStyles.card}>
            <View style={sharedStyles.row}>
              <View style={styles.copy}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={sharedStyles.small}>{item.category || 'Uncategorized'}</Text>
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
});
