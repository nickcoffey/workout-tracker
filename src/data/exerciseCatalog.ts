import { Exercise } from './types';

export type ExerciseFilters = {
  query: string;
  muscleGroup: string | null;
  equipment: string | null;
};

export type StarterExercise = {
  name: string;
  muscleGroup: string;
  equipment: string;
};

export const starterExercises: StarterExercise[] = [
  { name: 'Back Squat', muscleGroup: 'Legs', equipment: 'Barbell' },
  { name: 'Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
  { name: 'Bent-Over Row', muscleGroup: 'Back', equipment: 'Barbell' },
  { name: 'Deadlift', muscleGroup: 'Posterior Chain', equipment: 'Barbell' },
  { name: 'Dumbbell Curl', muscleGroup: 'Arms', equipment: 'Dumbbells' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable' },
  { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell' },
  { name: 'Pull-Up', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { name: 'Push-Up', muscleGroup: 'Chest', equipment: 'Bodyweight' },
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', equipment: 'Barbell' },
  { name: 'Triceps Pushdown', muscleGroup: 'Arms', equipment: 'Cable' },
];

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function matchesFilter(value: string | null, filter: string | null): boolean {
  if (!filter) {
    return true;
  }

  return value !== null && normalize(value) === normalize(filter);
}

export function filterExercises<T extends Exercise>(exercises: T[], filters: ExerciseFilters): T[] {
  const query = normalize(filters.query);

  return exercises.filter(
    (exercise) =>
      (!query || normalize(exercise.name).includes(query)) &&
      matchesFilter(exercise.muscleGroup, filters.muscleGroup) &&
      matchesFilter(exercise.equipment, filters.equipment),
  );
}

export function exerciseFilterOptions(exercises: Exercise[]): { muscleGroups: string[]; equipment: string[] } {
  const muscleGroups = new Set<string>();
  const equipment = new Set<string>();

  exercises.forEach((exercise) => {
    if (exercise.muscleGroup) {
      muscleGroups.add(exercise.muscleGroup);
    }

    if (exercise.equipment) {
      equipment.add(exercise.equipment);
    }
  });

  return {
    muscleGroups: Array.from(muscleGroups).sort((a, b) => a.localeCompare(b)),
    equipment: Array.from(equipment).sort((a, b) => a.localeCompare(b)),
  };
}

export function exerciseMetadataSummary(exercise: Pick<Exercise, 'category' | 'muscleGroup' | 'equipment'>): string {
  const parts = [exercise.muscleGroup, exercise.equipment].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(' · ');
  }

  return exercise.category ?? 'Uncategorized';
}

export function starterExercisesMissingFrom(existingNames: string[]): StarterExercise[] {
  const normalizedExistingNames = new Set(existingNames.map(normalize));

  return starterExercises.filter((exercise) => !normalizedExistingNames.has(normalize(exercise.name)));
}
