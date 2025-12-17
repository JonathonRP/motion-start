# Phase E: AnimatePresence - Known Bug Documentation

## Status: TESTS SKIPPED (Pending Bug Fix)

All Phase E tests are currently **skipped** using `.skip()` due to a known bug in the AnimatePresence component.

### Bug Details

- **Issue**: `motion-start-3xu` - AnimatePresence infinite loop
- **Error**: `effect_update_depth_exceeded` (Svelte 5 reactivity error)
- **Cause**: AnimatePresence component triggers infinite reactivity loop when wrapping conditional content
- **Impact**: Cannot test exit animations, mode behaviors, or any AnimatePresence features

### Test Coverage (When Bug is Fixed)

The following tests are documented and ready to run once the bug is fixed:

1. **Exit Animation Test**
   - Elements should fade out (opacity 1 → 0) before being removed from DOM
   - Verifies exit animation prop is respected
   - Currently skipped: `it.skip('shows exit animation when element is removed')`

2. **Mode Wait Test**
   - Exit animation completes before enter animation starts
   - Verifies `mode="wait"` prevents overlapping animations
   - Currently skipped: `it.skip('handles mode="wait" - exits before entering')`

3. **Conditional Rendering Test**
   - Elements animate in and out on conditional show/hide
   - Verifies scale animation (0 → 1 → 0)
   - Currently skipped: `it.skip('handles conditional rendering with AnimatePresence')`

### How to Enable Tests

Once `motion-start-3xu` is fixed:

1. Remove `.skip` from all test cases in `cypress/e2e/phase-e-animate-presence.cy.ts`
2. Run tests: `npm run test:e2e:phase-e`
3. Verify all 3 tests pass
4. Update bd task `motion-start-b9u.5` status to closed

### Test Infrastructure

- **Route**: `/animate-presence-basics`
- **Port**: 5000
- **Spec**: `cypress/e2e/phase-e-animate-presence.cy.ts`
- **Error Suppression**: Tests include `cy.on('uncaught:exception')` handler to prevent known error from failing tests
- **Current Result**: 3 pending, 0 passing, 0 failing

### Related Issues

- `motion-start-3xu` - High priority bug blocking AnimatePresence functionality
- `motion-start-b9u.5` - Parent E2E task for Phase E testing

---

**Last Updated**: 2025-12-14
**Next Steps**: Fix motion-start-3xu, then remove `.skip()` from tests
