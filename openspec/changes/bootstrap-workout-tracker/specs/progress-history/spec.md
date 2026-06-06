# progress-history Specification Delta

## ADDED Requirements
### Requirement: Show workout history
The system SHALL list completed workouts with date, exercise count, set count, and total volume.

#### Scenario: View completed workout
- GIVEN a workout has been finished
- WHEN the user opens History
- THEN the workout is shown with summary metrics
- AND the user can open workout details

### Requirement: Show exercise progress
The system SHALL show recent performance signals for each exercise.

#### Scenario: Exercise progress summary
- GIVEN the user has logged sets for an exercise
- WHEN the user views the exercise catalog
- THEN the system shows total sets, best weight, and last logged date
