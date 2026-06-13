## 1. Data Model

- [x] 1.1 Add exercise metadata fields for muscle group and equipment with a backward-compatible SQLite migration.
- [x] 1.2 Update TypeScript exercise types and repository mapping for the new metadata fields.
- [x] 1.3 Add idempotent starter exercise seeding during database initialization.

## 2. Catalog Behavior

- [x] 2.1 Update create and edit exercise flows to save structured metadata.
- [x] 2.2 Add shared search/filter helpers for exercise name, muscle group, and equipment.
- [x] 2.3 Preserve duplicate-name protection and used-exercise deletion behavior.

## 3. UI

- [x] 3.1 Update the Exercises tab to show starter exercises, metadata fields, search, filters, and filtered empty states.
- [x] 3.2 Update the Log tab exercise picker to support the same search/filter behavior while keeping active-workout disabled states clear.
- [x] 3.3 Keep the catalog UI compact enough for iPhone-sized screens during workout logging.

## 4. Verification

- [x] 4.1 Add or update focused tests for exercise filtering and starter seeding behavior.
- [x] 4.2 Run typecheck and tests.
- [x] 4.3 Manually verify catalog creation, filtering, seeding, and logging picker behavior in the iOS simulator.
