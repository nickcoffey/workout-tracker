# Bootstrap Workout Tracker

## Problem
The repository is empty and needs a working iOS-first React Native application plus living specs before additional workout-tracking changes can be managed safely.

## Proposed Solution
Scaffold an Expo TypeScript app, add Expo Router tabs, persist workout data locally with SQLite, and create the initial OpenSpec capability specs for workout logging, exercise catalog management, and progress history.

## Scope
- In scope: local-only workout logging, exercise catalog, workout history, simple exercise progress, and initial OpenSpec artifacts.
- Out of scope: accounts, cloud sync, social features, subscriptions, wearable integrations, advanced analytics, and backend services.

## Risks
- SQLite APIs must be kept behind a repository layer so future persistence changes do not spread through UI code.
- Exercise deletion must not break historical workout details.
