# Project Instructions

## Expo Version Gate

Expo has changed. Before changing application code, read the exact versioned Expo SDK 56 docs at https://docs.expo.dev/versions/v56.0.0/.

Use the SDK 56 reference for package APIs and install guidance. This app is on Expo SDK 56, React 19, React Native 0.85, Expo Router, and Expo SQLite.

## Repository Shape

- `app/` contains Expo Router routes and layouts.
- `src/data/` contains the local SQLite repository, domain types, and pure data helpers.
- `src/ui/` contains shared React Native UI primitives and design tokens.
- `openspec/` contains spec-driven change proposals, task lists, and archived changes.

Keep new code in the smallest existing area that matches the responsibility. Avoid adding new top-level frameworks or state managers unless a change clearly needs them.

## TypeScript

- Keep TypeScript strict. Prefer explicit domain types over `any`.
- Model database rows separately from app-facing camelCase types.
- Keep parsing and validation close to input boundaries, especially route params and text input values.
- Use named exports for shared helpers and repository functions.

## Expo And React Native

- Install Expo-managed packages with `npx expo install` so versions stay compatible with SDK 56.
- Import navigation APIs from `expo-router`; do not import application navigation APIs from external `@react-navigation/*` packages.
- Prefer React Native primitives and `StyleSheet.create` for app UI.
- Preserve accessibility basics such as `accessibilityRole` on actionable `Pressable` components.

## Verification

- Run `npm run typecheck` after TypeScript or route changes.
- Run `npm test` after changing data helpers, repository behavior, or business logic.
- For user-facing screen changes, also run or manually inspect the Expo app when practical.

## Commit Messages

Conventional commits are required. Before creating or suggesting a commit message, follow `COMMIT_MESSAGES.md`.

## OpenSpec

For feature work, inspect active changes under `openspec/changes/` before implementing. Keep implementation aligned with the relevant proposal, design, tasks, and delta specs. Update task checkboxes as work is completed.
