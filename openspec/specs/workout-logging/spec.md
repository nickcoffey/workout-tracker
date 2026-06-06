# workout-logging Specification

## Purpose
Support local logging of workout sessions with exercises, sets, reps, weight, and optional notes.

## Requirements
### Requirement: Start an active workout
The system SHALL let the user start a workout session stored on the device.

#### Scenario: Start workout
- GIVEN no workout is currently active
- WHEN the user starts a workout
- THEN the system creates a workout with a start timestamp
- AND the workout remains active until finished

### Requirement: Log exercises and sets
The system SHALL let the user add catalog exercises to an active workout and record sets.

#### Scenario: Add set to workout exercise
- GIVEN an active workout contains an exercise
- WHEN the user enters reps and weight
- THEN the system records a numbered set for that exercise

#### Scenario: Edit or delete a set
- GIVEN a set has been recorded
- WHEN the user edits or deletes the set
- THEN the system updates the active workout immediately
- AND remaining set numbers stay ordered

### Requirement: Finish workout
The system SHALL let the user finish an active workout.

#### Scenario: Completed workout appears in history
- GIVEN an active workout has been started
- WHEN the user finishes the workout
- THEN the system stores a finish timestamp
- AND the workout is listed in workout history
