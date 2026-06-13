## Why

Logging sets during a workout should stay fast once the user is in motion. The current Log screen supports the right core actions, but exercise picking stays visually prominent while logging, editing a set jumps through a shared form, and repeated sets require re-entering the same values.

## What Changes

- Add a quick repeat action for active workout sets so users can duplicate the most recent set values for an exercise with one tap.
- Make set editing inline within the set row so changes happen in place without moving attention to the add-set form.
- Move exercise selection behind a compact "Add Exercise" action or sheet so active workout logging remains the primary screen content.
- Preserve the existing active workout lifecycle, exercise catalog, set numbering, validation rules, and local SQLite persistence.
- Keep completed workout history read-only in this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `workout-logging`: active workout logging gains faster repeated-set entry, inline active-set editing, and a less intrusive exercise picker.

## Impact

- Affects the Log tab route in `app/(tabs)/index.tsx`.
- May add small shared UI primitives in `src/ui/` only if the interaction is reused or keeps the route readable.
- May add a focused data helper or repository function in `src/data/` if repeating a set is cleaner as a domain operation.
- Requires `npm run typecheck`; run `npm test` if data helpers or repository behavior change.
