# Data Layer Instructions

This directory owns the local workout domain model, SQLite persistence, and pure data helpers.

## SQLite

- Use `expo-sqlite` SDK 56 APIs consistently with the existing async repository style.
- Keep the shared `openDatabaseAsync` promise unless a broader database lifecycle refactor is intentional.
- Use parameter binding with `runAsync`, `getFirstAsync`, and `getAllAsync` for values that can come from users.
- Use `execAsync` only for static schema or bulk statements, never for interpolated user input.
- Keep schema initialization and migrations idempotent.
- Enable and preserve foreign-key behavior when touching schema setup.
- Use transactions for multi-step writes that must stay consistent, and keep all related queries inside the transaction callback.

## Types And Mapping

- Define row types with database column names and map them to exported camelCase domain types.
- Represent nullable database columns as `null`, not `undefined`, in exported domain objects.
- Preserve historical workout readability when exercises are edited or deleted.
- Keep set numbering deterministic after inserts and deletes.

## Tests

- Put pure calculations and collection transforms in testable helpers.
- Add focused `node:test` coverage for new helper behavior, migrations that can be isolated, and edge cases around workout summaries or exercise filtering.
