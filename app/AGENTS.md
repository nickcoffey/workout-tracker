# App Route Instructions

This directory uses Expo Router file-based routing. Route filenames and groups are part of the navigation contract, so change them deliberately.

## Routing

- Use `expo-router` APIs such as `Stack`, `Tabs`, `router`, `useFocusEffect`, and `useLocalSearchParams`.
- Keep route params as strings at the boundary and parse them before calling data-layer functions.
- Keep layout-level navigation options in `_layout.tsx` files when possible.
- Use route groups like `(tabs)` for organization without changing URL/path semantics.

## Screens

- Keep screens focused on loading state, user input, and composition.
- Put SQL and persistence logic in `src/data/`, not inside route components.
- Keep derived workout or catalog calculations in pure helpers when they can be tested without React Native.
- Use `useCallback` with `useFocusEffect` so screen refresh behavior stays stable.

## UI Behavior

- Prefer `FlatList` for lists of exercises, workouts, and sets.
- Preserve useful empty states for first-run and filtered views.
- Keep workout logging flows compact and usable on iPhone-sized screens.
- Validate text input before writes and show concise `Alert` messages for recoverable user errors.
