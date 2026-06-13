## Context

The current catalog is local-only and stored in SQLite. Exercises have `name`, optional `category`, timestamps, and historical workout references. The app starts with an empty catalog, so a new user must create exercises before logging meaningful sets.

## Goals / Non-Goals

**Goals:**
- Make the catalog useful on first launch with common starter exercises.
- Replace loose category-only organization with simple structured metadata for browsing.
- Keep search and filters lightweight enough to use while logging a workout.
- Preserve existing custom exercises and historical workout readability.

**Non-Goals:**
- No cloud exercise database or remote syncing.
- No generated workout programs or templates in this change.
- No body-diagram UI, media library, exercise instructions, or advanced analytics.

## Decisions

### Seed starter exercises locally and idempotently

Seed a curated list during database initialization only when matching exercises do not already exist. This avoids a separate onboarding step and keeps the app usable offline.

Alternative considered: prompt the user to import starter exercises. That gives more control, but adds friction before the first workout.

### Use simple structured metadata

Represent exercise organization with optional fields such as muscle group and equipment. Keep fields editable for user-created and seeded exercises so the app remains personal rather than pretending the starter catalog is authoritative.

Alternative considered: normalize muscle groups and equipment into separate lookup tables. That is more flexible, but likely premature for a single-user local app.

### Search and filter in both catalog and logging contexts

The Exercises tab and Add Exercise area in the Log tab should share the same basic search/filter behavior so finding an exercise feels consistent.

Alternative considered: only polish the Exercises tab. That would improve management, but the highest-pressure moment is during workout logging.

## Risks / Trade-offs

- Starter exercises may not match the user's training style -> keep seeded records editable and deletable when unused.
- Freeform metadata can drift over time -> keep the initial metadata vocabulary small and visible through filters.
- Adding columns requires migration care -> use additive SQLite changes and keep existing `category` data readable.
- Search/filter UI can crowd the Log screen -> prefer compact controls and keep empty states clear.

## Migration Plan

- Add metadata fields with backward-compatible defaults.
- Seed exercises after schema initialization using case-insensitive name checks.
- Preserve existing custom exercise names and historical references.
- Keep existing `category` content available, either mapped into the new metadata model or displayed as legacy text until edited.
