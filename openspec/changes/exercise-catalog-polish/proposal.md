## Why

The current exercise catalog works, but it starts empty and only supports a loose optional category. That makes the first-run experience feel like setup work before the user can log a real workout.

## What Changes

- Add a starter exercise catalog so common movements are available immediately.
- Expand exercise metadata beyond freeform category to support clearer grouping such as muscle group and equipment.
- Add catalog browsing affordances such as search and filtering so exercises are easier to find while logging.
- Preserve user-created exercises and workout history as catalog metadata evolves.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `exercise-catalog`: Add starter exercises, structured exercise metadata, and catalog search/filter behavior.

## Impact

- Affects the SQLite exercise schema and any migration/seed logic.
- Affects the Exercises tab and the Add Exercise picker in the Log tab.
- May require UI state for searching/filtering exercise lists.
- Does not require accounts, cloud sync, remote exercise databases, or paid services.
