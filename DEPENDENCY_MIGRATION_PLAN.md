# Dependency Internalization Migration Plan

**Objective:** Complete v11.11.11 alignment by internalizing all external dependencies (popmotion, framesync)

**Status:** Phase 1 Complete (style-value-types ✅)

---

## Current State Analysis

### Already Internalized ✅

#### 1. Frameloop System (`/frameloop/`)
- **Status:** Complete, based on v11.11.11
- **Provides:**
  - `frame` - Main RAF loop
  - `cancelFrame` - Cancel callbacks
  - `frameData` - Frame timing info
  - `frameSteps` - Pipeline steps (read, resolveKeyframes, update, preRender, render, postRender)
  - `microtask` - Microtask batching
  - `time` - Synchronized time
- **Can Replace:** All `framesync` imports (sync, cancelSync, getFrameData, flushSync)

#### 2. Math/Animation Utilities (`/utils/`)
- **Status:** Complete
- **Provides:**
  - `clamp` - Clamp values
  - `interpolate` - Value interpolation
  - `mix/*` - Number, color, complex mixing
  - `pipe` - Function composition
  - `progress` - Calculate progress between values
  - `wrap` - Wrap values
  - `distance` - Calculate distance
  - `velocity-per-second` - Velocity calculation
- **Can Replace:** popmotion utility functions

#### 3. Animation Generators (`/animation/generators/`)
- **Status:** Complete
- **Provides:**
  - `spring/` - Spring animations
  - `keyframes` - Keyframe animations
  - `inertia` - Inertia/decay animations
- **Can Replace:** popmotion `animate`, `inertia`

#### 4. Easing Functions (`/easing/`)
- **Status:** Complete
- **Provides:** All easing functions (ease, circ, back, anticipate, cubic-bezier, etc.)
- **Can Replace:** popmotion easing

#### 5. Value Types System (`/value-types/`)
- **Status:** Complete (just implemented)
- **Provides:** All CSS value parsing/transformation
- **Replaced:** style-value-types ✅

---

## Migration Roadmap

### Phase 2: Replace Framesync → Frameloop

**Files to Update:** 10 files

| File | Current Import | New Import | Notes |
|------|---------------|------------|-------|
| `/value/index.ts` | `sync, getFrameData` | `frame, frameData` | Main MotionValue updates |
| `/value/use-combine-values.ts` | `sync` | `frame` | Combine values logic |
| `/render/index.ts` | `sync, cancelSync` | `frame, cancelFrame` | Visual element updates |
| `/render/dom/utils/batch-layout.ts` | `sync` | `frame` | Layout batching |
| `/render/dom/projection/utils.ts` | `sync` | `frame` | Projection calculations |
| `/projection/utils/projection-utils.ts` | `sync` | `frame` | Projection utilities |
| `/components/AnimateSharedLayout/utils/batcher.ts` | `sync, flushSync` | `frame, microtask` | Shared layout batching |
| `/components/AnimateSharedLayout/utils/crossfader.ts` | `sync, getFrameData` | `frame, frameData` | Crossfade animations |
| `/gestures/pan/PanSession.ts` | `sync, cancelSync, getFrameData` | `frame, cancelFrame, frameData` | Pan gesture tracking |
| `/gestures/drag/VisualElementDragControls.ts` | `flushSync` | `microtask` | Drag synchronization |

**Migration Pattern:**
```typescript
// Before:
import sync, { cancelSync, getFrameData } from 'framesync';
sync.update(() => { ... });
cancelSync.update(callback);
const data = getFrameData();

// After:
import { frame, cancelFrame, frameData } from '../frameloop/index.js';
frame.update(() => { ... });
cancelFrame(callback);
const data = frameData;
```

**Estimated Impact:** Low risk - API is nearly identical

---

### Phase 3: Replace Popmotion → Internalized Utils

**Files to Update:** 22 files

#### Category A: Math Utilities (15 files)

| File | Popmotion Imports | Internalized Replacements |
|------|------------------|--------------------------|
| `/animation/animators/utils/interpolate.ts` | `interpolate` | `../../../utils/interpolate.js` |
| `/animation/generators/keyframes.ts` | `interpolate` | `../../utils/interpolate.js` |
| `/animation/utils/transitions.ts` | `animate, inertia, AnimationOptions` | `../generators/* + types` |
| `/components/AnimateSharedLayout/utils/crossfader.ts` | `circOut, linear, mix, mixColor, progress, PlaybackControls` | `../../easing, ../../utils/mix, ../../utils/progress` |
| `/gestures/drag/utils/constraints.ts` | `mix` | `../../../utils/mix/index.js` |
| `/gestures/drag/VisualElementDragControls.ts` | `progress` | `../../utils/progress.js` |
| `/gestures/pan/PanSession.ts` | `distance, pipe` | `../../utils/distance.js, ../../utils/pipe.js` |
| `/gestures/press/use-tap-gesture.svelte.ts` | `pipe` | `../../utils/pipe.js` |
| `/motion/features/layout/utils.ts` | `mix` | `../../utils/mix/index.js` |
| `/projection/geometry/delta-apply.ts` | `mix` | `../../utils/mix/index.js` |
| `/projection/geometry/delta-calc.ts` | `clamp, distance, mix, progress` | `../../utils/*` |
| `/render/index.ts` | `pipe` | `../utils/pipe.js` |
| `/utils/geometry/delta-apply.ts` | `mix` | `../mix/index.js` |
| `/utils/geometry/delta-calc.ts` | `clamp, distance, mix, progress` | `../*` |
| `/utils/transform.ts` | `interpolate, Easing` | `./interpolate.js, ../easing/types.js` |
| `/utils/use-cycle.svelte.ts` | `wrap` | `./wrap.js` |

#### Category B: Animation APIs (3 files)

| File | Current | Replacement Strategy |
|------|---------|---------------------|
| `/animation/animators/MainThreadAnimation.ts` | `animate as popmotionAnimate, AnimationOptions` | Use internal generators + driver |
| `/value/use-spring.svelte.ts` | `animate, SpringOptions` | Use spring generator directly |
| `/value/index.ts` | `velocityPerSecond` | `../utils/velocity-per-second.js` |

#### Category C: Type Imports (4 files)

| File | Type Imports | Action |
|------|-------------|--------|
| `/animation/animators/MainThreadAnimation.ts` | `AnimationOptions as PopmotionOptions` | Use internal types |
| `/animation/utils/transitions.ts` | `AnimationOptions` | Use internal types |
| `/components/AnimateSharedLayout/utils/crossfader.ts` | `PlaybackControls` | Define internally or use animation types |
| `/value/use-spring.svelte.ts` | `SpringOptions` | Use internal spring types |

**Critical Files - Need Careful Migration:**

1. **`/animation/animators/MainThreadAnimation.ts`**
   - Currently uses `popmotion.animate()` internally
   - **Solution:** Already uses frameloop driver, just need to ensure generator integration

2. **`/value/use-spring.svelte.ts`**
   - Uses `popmotion.animate()` for spring animations
   - **Solution:** Use internal spring generator + frameloop

3. **`/animation/utils/transitions.ts`**
   - Uses `popmotion.animate()` and `popmotion.inertia()`
   - **Solution:** Use internal generators

---

## Implementation Strategy

### Step 1: Update Utility Imports (Low Risk)
Replace simple utility imports (mix, clamp, pipe, etc.) - **15 files**

### Step 2: Replace Framesync (Low Risk)
Replace framesync with frameloop - **10 files**

### Step 3: Update Animation APIs (Medium Risk)
Migrate animate() and inertia() calls - **3 files**

### Step 4: Clean Types (Low Risk)
Update type imports - **4 files**

### Step 5: Remove Dependencies
Remove from `package.json`:
- `framesync: ^6.1.2`
- `popmotion: ^11.0.5`

### Step 6: Test & Fix
- Run type check
- Run unit tests
- Run browser tests
- Fix any issues

---

## Risk Assessment

### Low Risk (25 files)
- Simple 1:1 replacements
- Utility functions with same signatures
- Framesync → frameloop (nearly identical API)

### Medium Risk (3 files)
- Animation APIs using `popmotion.animate()`
- May need generator integration updates
- Should work since we already have generators

### Testing Strategy

1. **After each category:** Run type check
2. **After all replacements:** Run full test suite
3. **Fix incrementally:** Address failures one by one
4. **Verify builds:** Ensure production build succeeds

---

## Expected Outcomes

### Benefits
✅ Zero external animation dependencies (only tslib)
✅ Fully self-contained library
✅ True v11.11.11 alignment
✅ Smaller bundle size (tree-shakeable internals)
✅ No dependency version conflicts
✅ Complete control over animation engine

### Breaking Changes
None expected - all replacements are internal

### Bundle Size Impact
- Remove: ~50KB (popmotion + framesync + style-value-types)
- Add: ~15KB (internalized utilities)
- **Net savings: ~35KB**

---

## Rollback Plan

If issues arise:
1. Git revert to commit before migration
2. Individual file rollbacks possible
3. Can keep style-value-types internalized separately

---

## Timeline Estimate

- **Step 1 (Utilities):** 15 files × 2 min = 30 minutes
- **Step 2 (Framesync):** 10 files × 3 min = 30 minutes
- **Step 3 (Animation):** 3 files × 10 min = 30 minutes
- **Step 4 (Types):** 4 files × 2 min = 10 minutes
- **Step 5 (Package.json):** 5 minutes
- **Step 6 (Testing):** 30 minutes

**Total: ~2 hours of focused work**

---

## Success Criteria

✅ Zero TypeScript errors
✅ All tests passing (unit + browser)
✅ Package.json has only `tslib` dependency
✅ Build succeeds
✅ No runtime errors in demos

---

## Next Actions

1. Review this plan
2. Approve to proceed
3. Execute migration systematically
4. Test thoroughly
5. Commit and push
6. Update documentation

**Ready to proceed with full migration?**
