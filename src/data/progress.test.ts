import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { orderedSetsAfterDelete, summarizeWorkout } from './progress';
import { WorkoutExerciseWithSets } from './types';

const baseSet = {
  workoutExerciseId: 1,
  notes: null,
  createdAt: '2026-06-05T00:00:00.000Z',
  updatedAt: '2026-06-05T00:00:00.000Z',
};

describe('progress helpers', () => {
  it('summarizes workout set count, volume, and best weight', () => {
    const exercises: WorkoutExerciseWithSets[] = [
      {
        id: 1,
        workoutId: 1,
        exerciseId: 1,
        exerciseName: 'Bench Press',
        position: 1,
        sets: [
          { ...baseSet, id: 1, setNumber: 1, reps: 5, weight: 135 },
          { ...baseSet, id: 2, setNumber: 2, reps: 5, weight: 145 },
        ],
      },
    ];

    assert.deepEqual(summarizeWorkout(exercises), {
      setCount: 2,
      totalVolume: 1400,
      bestWeight: 145,
    });
  });

  it('renumbers remaining sets after deletion', () => {
    const sets = [
      { ...baseSet, id: 1, setNumber: 1, reps: 5, weight: 100 },
      { ...baseSet, id: 2, setNumber: 2, reps: 5, weight: 105 },
      { ...baseSet, id: 3, setNumber: 3, reps: 5, weight: 110 },
    ];

    assert.deepEqual(
      orderedSetsAfterDelete(sets, 2).map((set) => [set.id, set.setNumber]),
      [
        [1, 1],
        [3, 2],
      ],
    );
  });
});
