---
name: openspec-select-apply
description: List OpenSpec changes in the current repository, help the user choose an active change, and then run the OpenSpec Apply workflow for the selected change. Use when the user wants to browse available OpenSpec changes before implementing one, asks to choose which change to apply, or wants a change picker in front of openspec-apply-change.
---

# OpenSpec Select Apply

List repository OpenSpec changes, ask the user which active change to apply, then continue with the `openspec-apply-change` skill for the selected change.

## Workflow

1. Confirm you are at the repository root or find it by locating `openspec/changes`.

2. List active changes with:

   ```bash
   openspec list --json
   ```

3. Also inspect archived changes for visibility:

   ```bash
   find openspec/changes/archive -type d
   ```

   If the archive folder does not exist, continue without archived entries. Treat direct children of `openspec/changes/archive` as archived change names; ignore nested directories such as `specs`.

4. Present a concise picker to the user:
   - Show active changes first, including task progress and status from `openspec list --json`.
   - Show archived changes in a separate "Archived" section when any exist.
   - Make clear that only active changes can be applied.

5. If there is exactly one active change and the user did not explicitly ask to choose manually, ask for confirmation before applying it.

6. If there are multiple active changes, ask the user to choose one. Prefer a native user-selection tool when available. If no such tool is available, ask a concise plain-text question and wait for the answer.

7. Resolve the selection:
   - Accept the exact change name.
   - Accept an unambiguous numeric choice from your displayed list.
   - If the answer is ambiguous, ask again with the active change names.
   - If the selected change is archived, explain that archived changes are not apply targets and ask for an active change instead.

8. After selecting an active change, announce:

   ```text
   Using change: <change-name>
   ```

9. Continue by invoking or following the `openspec-apply-change` skill with the selected change name. Read that skill before applying if it is not already loaded.

## Output Shape

Use a compact list:

```text
Active OpenSpec changes:
1. setup-no-paid-ios-dev-lane - in-progress, 0/7 tasks
2. exercise-catalog-polish - in-progress, 0/12 tasks

Archived:
- 2026-06-06-bootstrap-workout-tracker

Which active change should I apply?
```

## Guardrails

- Do not apply an archived change.
- Do not edit implementation files until the user has selected or confirmed an active change.
- After selection, defer to `openspec-apply-change` for status checks, context file reads, implementation steps, task checkboxes, and verification behavior.
- If `openspec list --json` fails, report the failure and inspect `openspec/changes` only as a fallback for display; do not apply until an active change can be confidently identified.
