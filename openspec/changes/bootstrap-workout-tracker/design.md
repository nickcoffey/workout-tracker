# Design

## App Structure
The app uses Expo Router with a root stack and three tabs: Log, History, and Exercises. Workout details live outside the tab navigator at `workout/[id]`.

## Persistence
The app uses `expo-sqlite` with a local database named `workout-tracker.db`. The repository layer initializes schema and exposes typed functions for screens.

## Data Rules
- Only one unfinished workout is treated as active.
- Workout exercises preserve insertion order through a `position` column.
- Set entries preserve display order through `set_number`.
- Exercise names are unique case-insensitively.
- Used exercises are protected from deletion by SQLite foreign keys.

## UI
The UI uses React Native primitives, safe areas, restrained cards, compact forms, and iOS-friendly touch targets.
