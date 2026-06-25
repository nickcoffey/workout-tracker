import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { renumberPositions } from './workoutOrder';

describe('workout order helpers', () => {
  it('renumbers remaining exercises after a removal', () => {
    const remainingExercises = [
      { id: 10, position: 1 },
      { id: 30, position: 3 },
      { id: 40, position: 4 },
    ];

    assert.deepEqual(
      renumberPositions(remainingExercises).map((exercise) => [exercise.id, exercise.position]),
      [
        [10, 1],
        [30, 2],
        [40, 3],
      ],
    );
  });
});
