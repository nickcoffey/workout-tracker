import { SetEntry, WorkoutExerciseWithSets, WorkoutStats } from './types';

export function calculateSetVolume(set: Pick<SetEntry, 'reps' | 'weight'>): number {
  return set.reps * set.weight;
}

export function summarizeWorkout(exercises: WorkoutExerciseWithSets[]): WorkoutStats {
  const sets = exercises.flatMap((exercise) => exercise.sets);
  const weights = sets.map((set) => set.weight);

  return {
    setCount: sets.length,
    totalVolume: sets.reduce((total, set) => total + calculateSetVolume(set), 0),
    bestWeight: weights.length > 0 ? Math.max(...weights) : null,
  };
}

export function orderedSetsAfterDelete(sets: SetEntry[], deletedSetId: number): SetEntry[] {
  return sets
    .filter((set) => set.id !== deletedSetId)
    .sort((a, b) => a.setNumber - b.setNumber)
    .map((set, index) => ({ ...set, setNumber: index + 1 }));
}

export function formatWeight(weight: number): string {
  return `${weight.toLocaleString(undefined, { maximumFractionDigits: 1 })} lb`;
}
