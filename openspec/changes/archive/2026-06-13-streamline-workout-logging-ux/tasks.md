## 1. Preparation

- [x] 1.1 Read the Expo SDK 56 docs relevant to the implementation before changing app code, especially React Native primitives used through Expo and any modal/input behavior chosen for the picker.
- [x] 1.2 Review `app/(tabs)/index.tsx`, `src/ui/components.tsx`, and the `workout-logging` delta spec to confirm the current active-workout flow and target behavior.

## 2. Compact Exercise Picker

- [x] 2.1 Refactor the Log tab so an active workout shows a compact Add Exercise control instead of the full picker inline above logged exercises.
- [x] 2.2 Move the existing exercise search, muscle filter, equipment filter, empty state, already-added state, and selection behavior into a dismissible picker surface.
- [x] 2.3 Ensure selecting a non-added exercise adds it to the active workout, refreshes workout state, and returns focus to the active workout logging view.
- [x] 2.4 Preserve a prominent add-first-exercise path when an active workout has no exercises.

## 3. Repeat Latest Set

- [x] 3.1 Add a repeat action to each active exercise card only when that exercise has at least one logged set.
- [x] 3.2 Implement repeat behavior so it creates a new set from the latest set's reps, weight, and notes using the next ordered set number.
- [x] 3.3 Keep the route implementation simple by reusing `addSetEntry` where practical, or add a small tested data helper if choosing the latest set belongs outside the component.
- [x] 3.4 Refresh the active workout after repeating a set and keep validation/error handling consistent with existing set entry behavior.

## 4. Inline Set Editing

- [x] 4.1 Replace the current set Edit behavior with an inline edit state rendered within the selected set row.
- [x] 4.2 Provide inline reps, weight, and notes inputs plus Save and Cancel actions with accessible press targets.
- [x] 4.3 Save valid inline edits through the existing set update path without changing set order.
- [x] 4.4 Reject invalid inline edits with the existing concise validation style and keep original set values unchanged.
- [x] 4.5 Keep the add-set form dedicated to adding new sets rather than editing existing sets.

## 5. Verification

- [x] 5.1 Run `npm run typecheck`.
- [x] 5.2 Run `npm test` if a data helper or repository behavior is added or changed.
- [x] 5.3 Manually inspect the Log tab on an iPhone-sized screen: start or use an active workout, add an exercise from the compact picker, add a set, repeat it, inline-edit it, cancel an edit, delete a set, and finish the workout.
- [x] 5.4 Update these task checkboxes as implementation steps are completed.

Note: Task 5.3 was manually validated by the user after implementation.
