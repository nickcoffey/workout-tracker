## ADDED Requirements

### Requirement: Keep exercise selection secondary during active logging
The system SHALL let the user open and dismiss exercise selection from a compact control while an active workout is in progress, and SHALL keep logged workout exercises and set actions as the primary Log screen content.

#### Scenario: Open exercise picker during active workout
- **GIVEN** an active workout is in progress
- **WHEN** the user activates the Add Exercise control
- **THEN** the system presents exercise search, filters, and selectable catalog exercises
- **AND** the user can dismiss the picker without changing the workout

#### Scenario: Add exercise from picker
- **GIVEN** an active workout is in progress
- **AND** the exercise picker is open
- **WHEN** the user selects a catalog exercise that is not already in the workout
- **THEN** the system adds the exercise to the active workout
- **AND** the system returns focus to the active workout logging view

#### Scenario: Active workout with no exercises
- **GIVEN** an active workout is in progress
- **AND** no exercises have been added
- **WHEN** the Log screen is displayed
- **THEN** the system shows a prominent path to add the first exercise

### Requirement: Repeat the latest set quickly
The system SHALL let the user add a new set for an active workout exercise by repeating the exercise's most recent logged set values.

#### Scenario: Repeat latest set
- **GIVEN** an active workout exercise has at least one logged set
- **WHEN** the user activates the repeat set action for that exercise
- **THEN** the system records a new set for that exercise
- **AND** the new set uses the previous set's reps, weight, and notes
- **AND** the new set receives the next ordered set number

#### Scenario: Repeat unavailable without prior set
- **GIVEN** an active workout exercise has no logged sets
- **WHEN** the exercise card is displayed
- **THEN** the system does not offer a repeat set action for that exercise

### Requirement: Edit active workout sets inline
The system SHALL let the user edit an active workout set's reps, weight, and notes in place within the set row.

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
