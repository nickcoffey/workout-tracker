# Commit Message Instructions

Conventional commits are required for this repository.

## Format

Use this structure:

```text
type(optional-scope): concise summary

optional body

optional footer
```

## Types

Use the smallest accurate type:

- `feat`: user-facing feature or capability
- `fix`: bug fix
- `docs`: documentation or instruction-only change
- `style`: formatting-only change
- `refactor`: code change that is neither a feature nor a fix
- `test`: test-only change
- `chore`: maintenance, tooling, dependency, or metadata change
- `build`: build system or dependency packaging change
- `ci`: CI configuration or workflow change
- `perf`: performance improvement

## Scopes

Prefer a short scope when it clarifies the affected area:

- `app`
- `data`
- `ui`
- `openspec`
- `deps`
- `docs`

Omit the scope when the change is broad or a scope would add little value.

## Summary

- Use imperative mood: `add`, `fix`, `update`, `remove`.
- Keep the summary under 72 characters when practical.
- Do not capitalize the first word after the colon unless it is a proper noun.
- Do not end the summary with a period.

## Body And Footer

- Add a body when the reason, trade-off, migration detail, or testing context is not obvious from the diff.
- Wrap body lines near 72 characters.
- Use `BREAKING CHANGE:` in the footer for breaking changes.
- Reference issues or OpenSpec changes in the footer when relevant.

## Examples

```text
feat(data): seed starter exercises
fix(app): validate workout route ids
docs: add Codex repository instructions
test(data): cover exercise filtering helpers
```
