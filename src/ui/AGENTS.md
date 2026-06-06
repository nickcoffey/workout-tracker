# Shared UI Instructions

This directory owns shared React Native presentation primitives and design tokens.

## Design Tokens

- Reuse `colors`, `spacing`, and `radius` from `theme.ts` instead of hardcoding repeated values.
- Add new tokens only when they are reused or clarify an app-wide pattern.
- Keep the visual style restrained, compact, and practical for workout logging.

## Components

- Extend shared components only for behavior that appears in more than one screen.
- Keep shared components small and predictable; avoid hiding screen-specific data loading or persistence in UI primitives.
- Preserve touch target sizes around 44px or larger for primary actions and inputs.
- Prefer clear labels over decorative UI.

## Styling

- Use `StyleSheet.create`.
- Keep cards shallow; avoid nested card layouts.
- Ensure text can wrap and controls do not overlap on narrow mobile screens.
