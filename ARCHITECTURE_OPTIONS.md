# Architecture Decision: MotionValue Type Conflict Resolution

## Current State
- **motion-start** has its own `MotionValue` implementation in `src/lib/motion-start/value/`
- **Type imports** from `framer-motion/dom` exist in:
  - `src/lib/motion-start/animation/types.ts` (line 14)
  - `src/lib/motion-start/render/utils/KeyframesResolver.ts` (line 5)
- Current workaround: Type assertions (`as any`) in 3 places

## Option 1: Remove framer-motion/motion-dom imports entirely
**Current workaround approach - LEAST DISRUPTIVE**
- Keep local MotionValue implementation
- Remove type imports from `framer-motion/dom`
- Use type assertions only where base classes from motion-dom are used
- **Status**: Already partially implemented with `as any` assertions

**Pros:**
- No dependency on framer-motion/motion-dom types
- Full control over MotionValue implementation
- Minimal changes needed
- Compatible with Svelte 5 rune-based approach

**Cons:**
- Maintains type assertion workarounds (less clean)
- May miss breaking changes in motion-dom if used elsewhere
- Type safety gaps at integration points

## Option 2: Use motion-dom MotionValue exclusively
**REPLACEMENT APPROACH - SIGNIFICANT REFACTORING**
- Remove local `src/lib/motion-start/value/MotionValue.ts`
- Use motion-dom's MotionValue type and potentially runtime
- Update all imports throughout codebase
- Update package.json to depend on motion-dom directly

**Pros:**
- Full type compatibility with motion-dom
- Eliminates all type assertions
- Cleaner architecture
- May benefit from motion-dom optimizations

**Cons:**
- **MAJOR refactoring**: Affects 40+ files
- Need to verify motion-dom's MotionValue API matches all usage
- Dependency on external library updates
- May conflict with Svelte 5 paradigms
- Unknown whether motion-dom is maintained/stable

## Option 3: Remove motion-dom/framer-motion dependency entirely
**PURE SVELTE APPROACH - HIGHEST EFFORT**
- Don't use any framer-motion/motion-dom types
- Completely reimplement missing utilities
- Define all KeyframeResolver types locally
- Independent animation system

**Pros:**
- Zero external type dependencies
- Pure Svelte 5 implementation
- Full control over all code

**Cons:**
- Massive refactoring (100+ files)
- Re-implement complex WAAPI integration
- Test coverage implications
- May duplicate work that's well-tested elsewhere

## Recommendations

### Short-term (Current Status)
**Go with Option 1**: Keep type assertions, remove framer-motion type imports
- Change imports from `framer-motion/dom` to local types
- Consolidate type assertions to 3-4 clear locations
- Add comments explaining why assertions are needed
- **Work**: 30 minutes, low risk

### Medium-term
**Evaluate Option 2 if motion-dom stability is confirmed**
- Research motion-dom's maintenance status
- Check if their MotionValue matches our usage patterns
- Profile potential refactoring effort
- Assess compatibility with Svelte 5

### Implementation Path for Option 1

```typescript
// Before:
import type { MotionValue } from 'framer-motion/dom';

// After:
import type { MotionValue } from '../../value';
```

**Files to update:**
1. `src/lib/motion-start/animation/types.ts` - Replace type import
2. `src/lib/motion-start/render/utils/KeyframesResolver.ts` - Replace type import
3. Verify all type assertions are in comments explaining the compatibility

## Current Type Assertion Locations
1. `src/lib/motion-start/render/dom/DOMKeyframesResolver.ts:30` - MotionValue parameter
2. `src/lib/motion-start/animation/animators/AcceleratedAnimation.ts:120` - Constructor
3. `src/lib/motion-start/animation/interfaces/motion-value.ts:136` - Factory function
4. Additional assertions for property access (`.owner`, `.set`, `.setWithVelocity`)

All marked with comments: `// Type assertion: our MotionValue is structurally compatible...`
