## Context

The Log tab currently combines active workout status, full exercise search/filter controls, exercise selection chips, and per-exercise set logging in one FlatList header and item list. This works for the initial implementation, but it makes the logging surface feel heavier than the workout task: after an exercise is added, the catalog picker still occupies the top of the screen, repeated sets require retyping values, and editing a set reuses the add-set form instead of keeping the interaction near the set being changed.

The existing SQLite schema already supports the target behavior. Repeating a set can create another `set_entries` row with the next `set_number`; inline editing can call the existing update path; moving the picker can remain a route-level UI change.

## Goals / Non-Goals

**Goals:**

- Make active workout logging the primary content on the Log tab.
- Reduce repeated-set logging to one tap when the previous set values are acceptable.
- Keep set editing local to the set row being edited.
- Preserve current validation, set numbering, exercise catalog data, and active workout lifecycle.
- Keep the implementation small and aligned with React Native primitives and existing shared UI components.

**Non-Goals:**

- Editing completed workouts from History.
- Adding workout templates, supersets, timers, rest tracking, or planned routines.
- Changing the database schema unless implementation uncovers a clear need.
- Introducing new state managers, navigation libraries, or external UI dependencies.

## Decisions

### Use a compact exercise picker trigger

The Log tab should show a compact "Add Exercise" action while a workout is active. Activating it reveals the existing search, filters, and exercise choices in a contained picker surface such as a React Native `Modal`, an in-screen expandable panel, or another compact interaction that can be dismissed.

Rationale: the catalog is useful, but it is not the center of the screen once the workout has exercises. A compact trigger preserves access without making users scroll past picker controls between sets.

Alternative considered: keep the picker inline and collapse only filters. This helps a little, but still leaves catalog selection as the page structure instead of a temporary task.

### Keep repeat-set behavior local to each exercise

Each active exercise with at least one set should expose a repeat action that adds a new set using that exercise's latest set values. The latest set is the highest ordered set already displayed for that exercise.

Rationale: repeat-set logging is most useful in the common "same reps, same weight" path, and the current repository already calculates the next set number when adding a set.

Alternative considered: prefill the add-set form after saving. Prefill helps typing, but still requires field focus management and an explicit save for values that often do not change.

### Edit set rows in place

Set rows should switch into an inline editing state with reps, weight, notes, save, and cancel controls near the row. The add-set form should stay dedicated to adding new sets.

Rationale: editing in place reduces attention switching and avoids ambiguity about whether the bottom form is adding or editing.

Alternative considered: use a global modal editor for set edits. This can be clean, but it adds a heavier transition for a small correction.

### Prefer existing repository functions first

The first implementation should reuse `addSetEntry`, `updateSetEntry`, and `deleteSetEntry`. Add a helper such as `repeatLatestSetEntry(workoutExerciseId)` only if keeping repeat logic in the route becomes awkward or if tests are needed around choosing the latest set.

Rationale: the current repository is already small and explicit. Adding a domain helper is worthwhile only if it reduces duplication or clarifies behavior.

## Risks / Trade-offs

- Picker surface could feel too hidden for a brand-new workout -> keep an obvious empty-state or primary Add Exercise action when no exercises have been added.
- Inline editors can crowd narrow screens -> use compact inputs, wrapping actions, and preserve 44px touch targets.
- Repeat action may duplicate notes unexpectedly -> copy reps, weight, and notes because those are the complete set values; users can immediately inline-edit the repeated set if needed.
- Multiple inline editors could confuse the screen -> allow only one set row to be edited per exercise card, or one globally if that proves simpler.
