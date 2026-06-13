import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  exerciseFilterOptions,
  exerciseMetadataSummary,
  filterExercises,
  starterExercisesMissingFrom,
} from './exerciseCatalog';
import { Exercise } from './types';

const baseExercise = {
  category: null,
  createdAt: '2026-06-05T00:00:00.000Z',
  updatedAt: '2026-06-05T00:00:00.000Z',
};

const exercises: Exercise[] = [
  {
    ...baseExercise,
    id: 1,
    name: 'Bench Press',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
  },
  {
    ...baseExercise,
    id: 2,
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    equipment: 'Cable',
  },
  {
    ...baseExercise,
    id: 3,
    name: 'Push-Up',
    muscleGroup: 'Chest',
    equipment: 'Bodyweight',
  },
];

describe('exercise catalog helpers', () => {
  it('filters exercises by name, muscle group, and equipment', () => {
    assert.deepEqual(
      filterExercises(exercises, { query: 'press', muscleGroup: 'chest', equipment: 'barbell' }).map(
        (exercise) => exercise.name,
      ),
      ['Bench Press'],
    );
  });

  it('returns no matches when metadata filters do not match', () => {
    assert.deepEqual(filterExercises(exercises, { query: '', muscleGroup: 'Legs', equipment: null }), []);
  });

  it('builds sorted filter options from exercise metadata', () => {
    assert.deepEqual(exerciseFilterOptions(exercises), {
      muscleGroups: ['Back', 'Chest'],
      equipment: ['Barbell', 'Bodyweight', 'Cable'],
    });
  });

  it('summarizes metadata with legacy category fallback', () => {
    assert.equal(exerciseMetadataSummary(exercises[0]), 'Chest · Barbell');
    assert.equal(
      exerciseMetadataSummary({ category: 'Legacy strength', muscleGroup: null, equipment: null }),
      'Legacy strength',
    );
  });

  it('skips starter exercises that already exist case-insensitively', () => {
    assert.equal(
      starterExercisesMissingFrom(['bench press']).some((exercise) => exercise.name === 'Bench Press'),
      false,
    );
  });
});
