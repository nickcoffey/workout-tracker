## 1. Preparation

- [x] 1.1 Read the Expo SDK 56 docs relevant to the implementation before changing app code, especially React Native alert, pressable, and input behavior used by the Log and workout detail screens.
- [x] 1.2 Review `app/(tabs)/index.tsx`, `app/workout/[id].tsx`, `src/data/repository.ts`, and the `workout-logging` delta spec to confirm current note handling and active workout exercise flows.

## 2. Repository Support For Workout-Exercise Removal

- [x] 2.1 Add a repository helper in `src/data/repository.ts` to remove a workout exercise by id while keeping the remaining exercise positions ordered.
- [x] 2.2 Ensure removing a workout exercise also removes its associated set entries through existing SQLite cascade behavior rather than changing the schema.
- [x] 2.3 Add or update repository tests if needed to cover removal behavior, cascading set cleanup, and position renumbering.

## 3. Active Workout UI Updates

- [x] 3.1 Update `app/(tabs)/index.tsx` so each active workout exercise exposes a remove action.
- [x] 3.2 Add a confirmation step before removing an exercise, with copy that makes it clear logged sets for that exercise will also be removed.
- [x] 3.3 Remove note inputs and note text from the Log screen's add-set, inline edit, and read-only set states while preserving reps, weight, repeat-set, edit, and delete-set flows.
- [x] 3.4 Keep repeat-set behavior working with existing repository note support even though notes are no longer shown in the Log UI.

## 4. Workout Detail UI Updates

- [x] 4.1 Update `app/workout/[id].tsx` so workout detail screens no longer display stored set notes.
- [x] 4.2 Preserve the rest of the workout detail layout and historical set information while removing note text only.

## 5. Verification

- [x] 5.1 Run `npm run typecheck`.
- [x] 5.2 Run `npm test` if repository helpers or tests are added or changed.
- [ ] 5.3 Manually inspect the workout flow: start or resume an active workout, add an exercise, remove an exercise with and without sets, add and edit sets without notes, repeat a set, finish the workout, and confirm notes are hidden on the workout detail screen.
- [x] 5.4 Update these task checkboxes as implementation and verification steps are completed.
