import * as SQLite from 'expo-sqlite';

import { starterExercisesMissingFrom } from './exerciseCatalog';
import { renumberPositions } from './workoutOrder';
import {
  Exercise,
  ExerciseMetadataInput,
  ExerciseProgress,
  SetEntry,
  Workout,
  WorkoutDetail,
  WorkoutExerciseWithSets,
  WorkoutSummary,
} from './types';

type Database = SQLite.SQLiteDatabase;

type ExerciseRow = {
  id: number;
  name: string;
  category: string | null;
  muscle_group: string | null;
  equipment: string | null;
  created_at: string;
  updated_at: string;
};

type WorkoutRow = {
  id: number;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
};

type WorkoutSummaryRow = WorkoutRow & {
  exercise_count: number;
  set_count: number;
  total_volume: number | null;
};

type WorkoutDetailRow = WorkoutRow & {
  workout_exercise_id: number | null;
  exercise_id: number | null;
  exercise_name: string | null;
  position: number | null;
  set_id: number | null;
  set_number: number | null;
  reps: number | null;
  weight: number | null;
  set_notes: string | null;
  set_created_at: string | null;
  set_updated_at: string | null;
};

type ProgressRow = ExerciseRow & {
  total_sets: number;
  best_weight: number | null;
  last_logged_at: string | null;
};

let databasePromise: Promise<Database> | null = null;

function now(): string {
  return new Date().toISOString();
}

function cleanOptional(value?: string): string | null {
  return value?.trim() || null;
}

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    muscleGroup: row.muscle_group,
    equipment: row.equipment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    notes: row.notes,
  };
}

async function getDatabase(): Promise<Database> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('workout-tracker.db');
  }

  return databasePromise;
}

async function ensureExerciseMetadataColumns(db: Database): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(exercises)');
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has('muscle_group')) {
    await db.execAsync('ALTER TABLE exercises ADD COLUMN muscle_group TEXT');
  }

  if (!columnNames.has('equipment')) {
    await db.execAsync('ALTER TABLE exercises ADD COLUMN equipment TEXT');
  }
}

async function seedStarterExercises(db: Database): Promise<void> {
  const timestamp = now();
  const existingExercises = await db.getAllAsync<{ name: string }>('SELECT name FROM exercises');
  const missingStarterExercises = starterExercisesMissingFrom(existingExercises.map((exercise) => exercise.name));

  await db.withTransactionAsync(async () => {
    for (const exercise of missingStarterExercises) {
      await db.runAsync(
        `INSERT OR IGNORE INTO exercises
          (name, category, muscle_group, equipment, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
        exercise.name,
        null,
        exercise.muscleGroup,
        exercise.equipment,
        timestamp,
        timestamp,
      );
    }
  });
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      category TEXT,
      muscle_group TEXT,
      equipment TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT,
      UNIQUE(workout_id, exercise_id)
    );

    CREATE TABLE IF NOT EXISTS set_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
    );
  `);

  await ensureExerciseMetadataColumns(db);
  await seedStarterExercises(db);
}

export async function listExercisesWithProgress(): Promise<ExerciseProgress[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>(`
    SELECT
      e.id,
      e.name,
      e.category,
      e.muscle_group,
      e.equipment,
      e.created_at,
      e.updated_at,
      COUNT(se.id) AS total_sets,
      MAX(se.weight) AS best_weight,
      MAX(w.started_at) AS last_logged_at
    FROM exercises e
    LEFT JOIN workout_exercises we ON we.exercise_id = e.id
    LEFT JOIN workouts w ON w.id = we.workout_id
    LEFT JOIN set_entries se ON se.workout_exercise_id = we.id
    GROUP BY e.id
    ORDER BY LOWER(e.name) ASC
  `);

  return rows.map((row) => ({
    ...mapExercise(row),
    totalSets: row.total_sets,
    bestWeight: row.best_weight,
    lastLoggedAt: row.last_logged_at,
  }));
}

export async function createExercise(name: string, metadata: ExerciseMetadataInput = {}): Promise<Exercise> {
  const db = await getDatabase();
  const timestamp = now();
  const category = cleanOptional(metadata.category);
  const muscleGroup = cleanOptional(metadata.muscleGroup);
  const equipment = cleanOptional(metadata.equipment);
  const result = await db.runAsync(
    `INSERT INTO exercises
      (name, category, muscle_group, equipment, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)`,
    name.trim(),
    category,
    muscleGroup,
    equipment,
    timestamp,
    timestamp,
  );

  return {
    id: result.lastInsertRowId,
    name: name.trim(),
    category,
    muscleGroup,
    equipment,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function updateExercise(id: number, name: string, metadata: ExerciseMetadataInput = {}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE exercises
      SET name = ?, category = ?, muscle_group = ?, equipment = ?, updated_at = ?
      WHERE id = ?`,
    name.trim(),
    cleanOptional(metadata.category),
    cleanOptional(metadata.muscleGroup),
    cleanOptional(metadata.equipment),
    now(),
    id,
  );
}

export async function deleteExercise(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM exercises WHERE id = ?', id);
}

export async function startWorkout(): Promise<Workout> {
  const db = await getDatabase();
  const startedAt = now();
  const result = await db.runAsync('INSERT INTO workouts (started_at) VALUES (?)', startedAt);

  return {
    id: result.lastInsertRowId,
    startedAt,
    finishedAt: null,
    notes: null,
  };
}

export async function finishWorkout(workoutId: number, notes?: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE workouts SET finished_at = ?, notes = ? WHERE id = ?',
    now(),
    notes?.trim() || null,
    workoutId,
  );
}

export async function getActiveWorkout(): Promise<WorkoutDetail | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<WorkoutRow>(
    'SELECT * FROM workouts WHERE finished_at IS NULL ORDER BY started_at DESC LIMIT 1',
  );

  return row ? getWorkoutDetail(row.id) : null;
}

export async function addExerciseToWorkout(workoutId: number, exerciseId: number): Promise<void> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM workout_exercises WHERE workout_id = ? AND exercise_id = ?',
    workoutId,
    exerciseId,
  );

  if (existing) {
    return;
  }

  const positionRow = await db.getFirstAsync<{ next_position: number }>(
    'SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM workout_exercises WHERE workout_id = ?',
    workoutId,
  );

  await db.runAsync(
    'INSERT INTO workout_exercises (workout_id, exercise_id, position, created_at) VALUES (?, ?, ?, ?)',
    workoutId,
    exerciseId,
    positionRow?.next_position ?? 1,
    now(),
  );
}

export async function removeExerciseFromWorkout(workoutExerciseId: number): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ workout_id: number }>(
      'SELECT workout_id FROM workout_exercises WHERE id = ?',
      workoutExerciseId,
    );

    if (!existing) {
      return;
    }

    await db.runAsync('DELETE FROM workout_exercises WHERE id = ?', workoutExerciseId);

    const remainingExercises = await db.getAllAsync<{ id: number; position: number }>(
      'SELECT id, position FROM workout_exercises WHERE workout_id = ? ORDER BY position ASC, id ASC',
      existing.workout_id,
    );

    await Promise.all(
      renumberPositions(remainingExercises).map((exercise) =>
        db.runAsync('UPDATE workout_exercises SET position = ? WHERE id = ?', exercise.position, exercise.id),
      ),
    );
  });
}

export async function addSetEntry(
  workoutExerciseId: number,
  reps: number,
  weight: number,
  notes?: string,
): Promise<void> {
  const db = await getDatabase();
  const setNumberRow = await db.getFirstAsync<{ next_set_number: number }>(
    'SELECT COALESCE(MAX(set_number), 0) + 1 AS next_set_number FROM set_entries WHERE workout_exercise_id = ?',
    workoutExerciseId,
  );
  const timestamp = now();

  await db.runAsync(
    `INSERT INTO set_entries
      (workout_exercise_id, set_number, reps, weight, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    workoutExerciseId,
    setNumberRow?.next_set_number ?? 1,
    reps,
    weight,
    notes?.trim() || null,
    timestamp,
    timestamp,
  );
}

export async function updateSetEntry(
  setId: number,
  reps: number,
  weight: number,
  notes?: string,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE set_entries SET reps = ?, weight = ?, notes = ?, updated_at = ? WHERE id = ?',
    reps,
    weight,
    notes?.trim() || null,
    now(),
    setId,
  );
}

export async function deleteSetEntry(setId: number, workoutExerciseId: number): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM set_entries WHERE id = ?', setId);

    const rows = await db.getAllAsync<{ id: number }>(
      'SELECT id FROM set_entries WHERE workout_exercise_id = ? ORDER BY set_number ASC, id ASC',
      workoutExerciseId,
    );

    await Promise.all(
      rows.map((row, index) =>
        db.runAsync('UPDATE set_entries SET set_number = ?, updated_at = ? WHERE id = ?', index + 1, now(), row.id),
      ),
    );
  });
}

export async function getWorkoutHistory(): Promise<WorkoutSummary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<WorkoutSummaryRow>(`
    SELECT
      w.id,
      w.started_at,
      w.finished_at,
      w.notes,
      COUNT(DISTINCT we.id) AS exercise_count,
      COUNT(se.id) AS set_count,
      SUM(se.reps * se.weight) AS total_volume
    FROM workouts w
    LEFT JOIN workout_exercises we ON we.workout_id = w.id
    LEFT JOIN set_entries se ON se.workout_exercise_id = we.id
    WHERE w.finished_at IS NOT NULL
    GROUP BY w.id
    ORDER BY w.started_at DESC
  `);

  return rows.map((row) => ({
    ...mapWorkout(row),
    exerciseCount: row.exercise_count,
    setCount: row.set_count,
    totalVolume: row.total_volume ?? 0,
  }));
}

export async function getWorkoutDetail(workoutId: number): Promise<WorkoutDetail | null> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<WorkoutDetailRow>(
    `
      SELECT
        w.id,
        w.started_at,
        w.finished_at,
        w.notes,
        we.id AS workout_exercise_id,
        e.id AS exercise_id,
        e.name AS exercise_name,
        we.position,
        se.id AS set_id,
        se.set_number,
        se.reps,
        se.weight,
        se.notes AS set_notes,
        se.created_at AS set_created_at,
        se.updated_at AS set_updated_at
      FROM workouts w
      LEFT JOIN workout_exercises we ON we.workout_id = w.id
      LEFT JOIN exercises e ON e.id = we.exercise_id
      LEFT JOIN set_entries se ON se.workout_exercise_id = we.id
      WHERE w.id = ?
      ORDER BY we.position ASC, se.set_number ASC
    `,
    workoutId,
  );

  if (rows.length === 0) {
    return null;
  }

  const workout = mapWorkout(rows[0]);
  const exerciseMap = new Map<number, WorkoutExerciseWithSets>();

  rows.forEach((row) => {
    if (!row.workout_exercise_id || !row.exercise_id || !row.exercise_name || row.position === null) {
      return;
    }

    if (!exerciseMap.has(row.workout_exercise_id)) {
      exerciseMap.set(row.workout_exercise_id, {
        id: row.workout_exercise_id,
        workoutId: workout.id,
        exerciseId: row.exercise_id,
        exerciseName: row.exercise_name,
        position: row.position,
        sets: [],
      });
    }

    if (row.set_id && row.set_number && row.reps !== null && row.weight !== null && row.set_created_at && row.set_updated_at) {
      exerciseMap.get(row.workout_exercise_id)?.sets.push({
        id: row.set_id,
        workoutExerciseId: row.workout_exercise_id,
        setNumber: row.set_number,
        reps: row.reps,
        weight: row.weight,
        notes: row.set_notes,
        createdAt: row.set_created_at,
        updatedAt: row.set_updated_at,
      });
    }
  });

  return {
    ...workout,
    exercises: Array.from(exerciseMap.values()),
  };
}
