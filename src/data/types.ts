export type Exercise = {
  id: number;
  name: string;
  category: string | null;
  muscleGroup: string | null;
  equipment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseMetadataInput = {
  category?: string;
  muscleGroup?: string;
  equipment?: string;
};

export type Workout = {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  notes: string | null;
};

export type WorkoutExercise = {
  id: number;
  workoutId: number;
  exerciseId: number;
  exerciseName: string;
  position: number;
};

export type SetEntry = {
  id: number;
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutExerciseWithSets = WorkoutExercise & {
  sets: SetEntry[];
};

export type WorkoutDetail = Workout & {
  exercises: WorkoutExerciseWithSets[];
};

export type WorkoutSummary = Workout & {
  exerciseCount: number;
  setCount: number;
  totalVolume: number;
};

export type ExerciseProgress = Exercise & {
  totalSets: number;
  bestWeight: number | null;
  lastLoggedAt: string | null;
};

export type WorkoutStats = {
  setCount: number;
  totalVolume: number;
  bestWeight: number | null;
};
