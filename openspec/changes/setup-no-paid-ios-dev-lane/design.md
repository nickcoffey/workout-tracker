# Design

## Intent
The project should keep Expo SDK 56 and avoid downgrading just to fit an older Expo Go install. The first development-lane change should make simulator testing first-class and document the practical limits of no-paid iPhone testing.

## Development Build Strategy
Use `expo-dev-client` to create a project-specific development client. The development client acts as the app's own Expo Go-like shell for SDK 56 and future native dependencies.

## Simulator Lane
Add an iOS Simulator EAS build profile that produces a simulator-compatible `.app`. This lane does not require an Apple Developer Program account and gives a repeatable way to test outside Expo Go.

Expected loop:
- Build or run the simulator development client.
- Start Metro for the development client.
- Open the app in the simulator and continue normal development.

## Physical iPhone Lane
Treat real-device testing as an investigation path, not a guaranteed distribution workflow. The no-paid path is local compilation from macOS with Xcode/free provisioning, likely through `npx expo run:ios --device`.

The workflow should document:
- Required local tools: Xcode, connected iPhone, trusted device, iOS Developer Mode.
- Expected caveats: signing friction, possible seven-day expiration, and reinstall requirements.
- Boundary: EAS cloud builds for iOS devices and TestFlight require paid Apple credentials.

## Decision Boundary
Defer Apple Developer Program payment until the app is useful enough to justify persistent real-device installs, TestFlight, or App Store distribution.
