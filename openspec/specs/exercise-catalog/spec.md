# exercise-catalog Specification

## Purpose
Maintain the local exercise catalog used while logging workouts.

## Requirements
### Requirement: Manage exercises
The system SHALL let the user create, edit, and delete exercises stored on the device.

#### Scenario: Create exercise
- GIVEN the user provides a unique exercise name
- WHEN the user saves the exercise
- THEN the exercise appears in the catalog
- AND it is available when logging workouts

#### Scenario: Prevent duplicate names
- GIVEN an exercise already exists
- WHEN the user saves another exercise with the same name
- THEN the system rejects the duplicate

#### Scenario: Preserve workout history
- GIVEN an exercise has been used in a workout
- WHEN the user tries to delete it
- THEN the system keeps the exercise so workout history remains readable

### Requirement: Provide starter exercises
The system SHALL provide a starter catalog of common exercises for new local installs.

#### Scenario: Seed empty catalog
- WHEN the exercise catalog is initialized with no existing exercises
- THEN common starter exercises are available without manual entry

#### Scenario: Preserve existing catalog during seeding
- WHEN the exercise catalog is initialized with existing exercises
- THEN the system does not create duplicate exercises with the same case-insensitive name

### Requirement: Classify exercises with structured metadata
The system SHALL let exercises include structured metadata for browsing, including muscle group and equipment.

#### Scenario: Create exercise with metadata
- WHEN the user saves an exercise with muscle group or equipment values
- THEN the exercise stores those values with the exercise

#### Scenario: Edit seeded exercise metadata
- WHEN the user edits metadata on a seeded exercise
- THEN the updated metadata is used in the catalog and logging picker

### Requirement: Find exercises while browsing or logging
The system SHALL let the user search and filter exercises in both the catalog and workout logging contexts.

#### Scenario: Search exercises by name
- WHEN the user enters a search term
- THEN the exercise list shows matching exercises by name

#### Scenario: Filter exercises by metadata
- WHEN the user selects a muscle group or equipment filter
- THEN the exercise list shows exercises matching the selected filter

#### Scenario: Show empty filtered result
- WHEN no exercises match the active search or filter
- THEN the system shows an empty state that indicates no matching exercises were found
