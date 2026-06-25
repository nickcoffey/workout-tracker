## ADDED Requirements

### Requirement: Remove exercises from an active workout
The system SHALL let the user remove an exercise from an active workout.

#### Scenario: Confirm removing an exercise with no sets
- **GIVEN** an active workout contains an exercise with no logged sets
- **WHEN** the user confirms removing that exercise
- **THEN** the system removes the exercise from the active workout
- **AND** the exercise no longer appears in the active workout logging view

#### Scenario: Confirm removing an exercise with logged sets
- **GIVEN** an active workout contains an exercise with logged sets
- **WHEN** the user confirms removing that exercise
- **THEN** the system removes the exercise and its logged sets from the active workout
- **AND** the remaining workout exercises stay in ordered position

#### Scenario: Cancel removing an exercise
- **GIVEN** an active workout contains an exercise
- **WHEN** the user starts the remove action and cancels confirmation
- **THEN** the active workout remains unchanged

## MODIFIED Requirements

### Requirement: Log exercises and sets
The system SHALL let the user add catalog exercises to an active workout and record sets with reps and weight while keeping note fields out of the workout UI.

#### Scenario: Add set to workout exercise
- **GIVEN** an active workout contains an exercise
- **WHEN** the user enters reps and weight
- **THEN** the system records a numbered set for that exercise

#### Scenario: Edit or delete a set
- **GIVEN** a set has been recorded
- **WHEN** the user edits or deletes the set
- **THEN** the system updates the active workout immediately
- **AND** remaining set numbers stay ordered

#### Scenario: Notes are not shown while logging
- **GIVEN** an active workout contains an exercise
- **WHEN** the user views the add-set form or a logged set row
- **THEN** the system shows controls for reps and weight without showing set notes

### Requirement: Repeat the latest set quickly
The system SHALL let the user add a new set for an active workout exercise by repeating the exercise's most recent logged set values while keeping note handling out of the visible workout UI.

#### Scenario: Repeat latest set
- **GIVEN** an active workout exercise has at least one logged set
- **WHEN** the user activates the repeat set action for that exercise
- **THEN** the system records a new set for that exercise
- **AND** the new set uses the previous set's reps and weight
- **AND** the new set receives the next ordered set number

#### Scenario: Repeat preserves stored note data
- **GIVEN** an active workout exercise has a latest logged set with stored note data
- **WHEN** the user activates the repeat set action for that exercise
- **THEN** the system preserves the latest set's stored note data on the repeated set
- **AND** the visible workout UI still does not show note fields

#### Scenario: Repeat unavailable without prior set
- **GIVEN** an active workout exercise has no logged sets
- **WHEN** the exercise card is displayed
- **THEN** the system does not offer a repeat set action for that exercise

### Requirement: Edit active workout sets inline
The system SHALL let the user edit an active workout set's reps and weight in place within the set row without showing note fields in the workout UI.

#### Scenario: Save inline set edit
- **GIVEN** an active workout contains a logged set
- **WHEN** the user edits the set inline and saves valid reps and weight
- **THEN** the system updates the set immediately
- **AND** the set remains in its current ordered position

#### Scenario: Cancel inline set edit
- **GIVEN** an active workout contains a logged set
- **AND** the set row is in edit mode
- **WHEN** the user cancels editing
- **THEN** the system keeps the original set values unchanged
- **AND** the set row returns to display mode

#### Scenario: Reject invalid inline set edit
- **GIVEN** an active workout contains a logged set
- **AND** the set row is in edit mode
- **WHEN** the user saves non-positive reps or a negative weight
- **THEN** the system rejects the edit
- **AND** the system shows a concise recoverable validation message
- **AND** the original set values remain unchanged

#### Scenario: Notes are not shown while editing
- **GIVEN** an active workout contains a logged set
- **AND** the set row is in edit mode
- **WHEN** the inline editor is displayed
- **THEN** the system shows controls for reps and weight without showing a notes field

### Requirement: Finish workout
The system SHALL let the user finish an active workout.

#### Scenario: Completed workout appears in history
- **GIVEN** an active workout has been started
- **WHEN** the user finishes the workout
- **THEN** the system stores a finish timestamp
- **AND** the workout is listed in workout history

#### Scenario: Notes are not shown in workout details
- **GIVEN** a completed workout contains stored set note data
- **WHEN** the user opens that workout's detail view
- **THEN** the system shows the workout exercises and sets without displaying set notes
