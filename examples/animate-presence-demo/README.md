# AnimatePresence Bug Fix Demo

This demo showcases the fixes for AnimatePresence bugs in motion-start.

## Bugs Fixed

### Bug 1 - presenceAffectsLayout was a no-op
- Toggle the checkbox: with it ON siblings A & B shift during exit; with it OFF they stay put.

### Bug 2 - Race condition  
- Rapid-click Hide/Show: exit animation always fires correctly.

### Bug 3 - Double safeToRemove
- "onExitComplete called" counter increments by exactly 1 per hide.

## Running locally

```bash
npm install
npm run dev
```
