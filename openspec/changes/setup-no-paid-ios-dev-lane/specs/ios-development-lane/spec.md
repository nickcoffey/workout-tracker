# ios-development-lane Specification Delta

## ADDED Requirements
### Requirement: Support SDK 56 development without Expo Go
The project SHALL provide a development workflow that does not require Expo Go on the user's iPhone to support the app's Expo SDK version.

#### Scenario: Use simulator development client
- GIVEN the app targets Expo SDK 56
- WHEN the developer builds or runs the iOS Simulator development client
- THEN the app can be tested in the iOS Simulator without Expo Go
- AND the workflow does not require an Apple Developer Program subscription

### Requirement: Preserve no-paid physical-device option
The project SHALL document a local physical-iPhone testing path that can be attempted before paying for Apple Developer Program enrollment.

#### Scenario: Attempt local iPhone install
- GIVEN the developer has macOS, Xcode, and a connected iPhone with Developer Mode enabled
- WHEN the developer follows the local device workflow
- THEN the project documents how to attempt installing a development build on the iPhone
- AND it explains that free/local signing may expire or require reinstalling

### Requirement: Clarify paid Apple boundaries
The project SHALL distinguish no-paid development workflows from workflows that require paid Apple credentials.

#### Scenario: Avoid accidental paid dependency
- GIVEN the developer wants to avoid Apple Developer Program enrollment for now
- WHEN they read the development-lane documentation
- THEN EAS iOS device builds, TestFlight, App Store submission, and persistent distribution are identified as paid-account milestones
