## Why

Active workout logging should stay focused on the actions users repeat most: adding exercises, logging sets, and correcting mistakes quickly. The current Log screen still surfaces per-set notes in both add and edit flows, and once an exercise is added there is no direct way to remove it from the active workout if it was added by mistake.

## What Changes

- Add the ability to remove an exercise from an active workout directly from the workout logging UI.
- Remove set notes from user-facing screens, including the Log screen's add-set, inline edit, and read-only display states plus workout detail views, so the visible workflow centers on reps and weight.
- Keep note persistence in the database and repository APIs so existing data remains intact and backend/domain support stays available for future use.
- Preserve current active workout lifecycle, set numbering rules, repeat-set behavior, and workout history behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workout-logging`: active workout logging gains workout-exercise removal and the app hides set notes from user-facing workout UI while preserving note data in storage.

## Impact

- Affects the Log tab route in `app/(tabs)/index.tsx` and workout detail UI in `app/workout/[id].tsx`.
- Likely adds a focused repository helper in `src/data/repository.ts` to remove a workout exercise and rely on cascading set cleanup.
- Keeps `src/data/types.ts` note fields and SQLite note columns intact rather than changing the persistence model.
- Requires `npm run typecheck`; run `npm test` if repository behavior changes.
