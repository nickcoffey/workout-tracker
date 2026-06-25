## Context

The current workout logging flow already supports adding exercises, adding sets, repeating the latest set, inline set editing, and deleting individual sets. It also surfaces optional set notes in three user-facing places: the add-set form, the inline set editor, and the read-only set display on the Log screen. Completed workout detail screens also render stored set notes.

The SQLite schema and domain types already support notes and link `set_entries` to `workout_exercises` with `ON DELETE CASCADE`. That means the app can hide note UI without a data migration, and it can remove an entire workout exercise by deleting the `workout_exercises` row and letting associated sets be cleaned up automatically.

## Goals / Non-Goals

**Goals:**

- Let users remove an exercise from an active workout when it was added by mistake or is no longer needed.
- Hide set notes from user-facing workout UI while preserving note columns, types, and repository support.
- Keep workout exercise ordering stable after a removal so the remaining exercises stay in a predictable sequence.
- Keep the implementation small and aligned with the existing Expo Router route structure and SQLite repository patterns.

**Non-Goals:**

- Removing note support from the database, types, or repository APIs.
- Backfilling, clearing, or migrating existing note data.
- Editing completed workouts from History.
- Adding new workout metadata fields, templates, or other logging workflow changes unrelated to exercise removal and note visibility.

## Decisions

### Add a dedicated repository helper for workout-exercise removal

Introduce a focused repository function such as `removeExerciseFromWorkout(workoutExerciseId)` instead of embedding deletion logic directly in the route. The helper should delete the selected `workout_exercises` row inside a transaction, rely on SQLite cascade behavior to delete related `set_entries`, and then renumber the remaining `position` values for that workout.

Rationale: removing an exercise changes more than one row-level concern because remaining exercise positions must stay ordered. Keeping that logic in `src/data/repository.ts` makes the route simpler and gives tests a single behavioral entry point.

Alternative considered: delete the row directly from the screen and skip position cleanup. This is simpler at first, but it leaks ordering behavior into UI code or leaves gaps that make the workout detail harder to reason about.

### Confirm before removing an exercise

The Log screen should ask for confirmation before removing an exercise from the active workout, especially when the exercise already contains logged sets.

Rationale: removing an exercise is broader and more destructive than deleting a single set because it also removes all associated sets. A confirmation step reduces accidental loss while keeping the feature accessible.

Alternative considered: immediate deletion with no confirmation. This is faster, but the cost of a mistaken tap is high enough that the extra confirmation is worthwhile.

### Hide notes in UI but preserve note data paths

Remove note inputs and note text from workout-facing screens while leaving `notes` fields in the database schema, repository functions, and domain types unchanged. New set creation from the visible UI can pass no note value, while existing repository calls that already accept notes remain available. Repeating a prior set should continue carrying forward the underlying stored note if one exists, even though the note is not rendered in the UI.

Rationale: this matches the requested product direction without forcing a migration or closing off future backend or UI reuse of note data.

Alternative considered: remove notes end-to-end from types and storage. This would increase scope, risk data loss, and conflict with the requirement to keep backend logic intact.

### Treat note removal as a workout-wide UI policy

Hide set notes both while logging an active workout and when viewing workout detail history. The change should apply to the Log route and the workout detail route so note visibility does not depend on which screen the user opens.

Rationale: the request is phrased as removing notes from the UI, not just from one editing surface, and a consistent policy is easier to understand than partial visibility.

Alternative considered: hide notes only on the Log screen. This reduces implementation work, but it leaves notes visible elsewhere and would likely surprise users.

## Risks / Trade-offs

- Hidden notes still exist in storage -> Document this explicitly in the proposal/spec and avoid schema cleanup in this change.
- Exercise removal can erase multiple sets at once -> Use a confirmation prompt and clear destructive copy.
- Position renumbering after removal could be missed -> Keep renumbering in the repository helper and cover it with repository tests if the helper is added.
- Users lose a visible place to read older notes -> Accept this as part of the product simplification, while preserving data so the app can reintroduce notes later if needed.
