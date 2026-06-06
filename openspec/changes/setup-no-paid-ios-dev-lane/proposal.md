# Setup No-Paid iOS Dev Lane

## Problem
The app uses Expo SDK 56, but the user's iPhone can only install an Expo Go version that supports up to SDK 54. The iOS simulator works, but relying only on Expo Go blocks real-device feedback unless the user pays for an Apple Developer Program account before the app has proven useful.

## Proposed Solution
Create a development workflow that keeps SDK 56, avoids paid Apple distribution for now, and gives the project reliable simulator testing plus a documented local-device investigation path.

## Scope
- In scope: Expo development build setup, iOS Simulator development-build profile, local iPhone install investigation with Xcode/free provisioning, and documentation for the no-paid workflow.
- Out of scope: paid Apple Developer Program enrollment, TestFlight, App Store submission, production signing, cloud sync, and user-facing workout features.

## Risks
- Local iPhone installs without a paid Apple Developer account may be fragile, expire, or require periodic reinstalling.
- Adding a development client changes the dev loop from Expo Go to a custom app shell and may require rebuilds when native dependencies change.
- EAS iOS device builds still require paid Apple credentials, so the workflow must clearly distinguish simulator builds from physical-device distribution.
