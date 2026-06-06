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
