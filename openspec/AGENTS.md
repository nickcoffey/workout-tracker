# OpenSpec Instructions

This directory contains the spec-driven workflow for the app.

## Active Changes

- Check `openspec/changes/` for active proposals before implementing related work.
- Read the proposal, design, tasks, and delta specs for the active change that matches the request.
- Keep implementation scoped to accepted goals and non-goals unless the user explicitly expands the work.

## Specs And Tasks

- Update task checkboxes as implementation and verification steps are completed.
- Keep specs written as user-observable requirements with scenarios.
- When archiving or syncing, preserve the distinction between active delta specs and main specs under `openspec/specs/`.

## Project Context

The app is a local-first Expo workout tracker using SQLite. Spec changes should account for offline use, workout logging speed, and preserving historical workout data.
