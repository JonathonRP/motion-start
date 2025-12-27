# Motion-Start Next Steps

## ✅ Completed (Session 2025-12-27)

### Dependency Internalization (100%)
- ✅ Internalized popmotion, framesync, style-value-types
- ✅ All 136 unit tests passing
- ✅ 0 TypeScript errors in source code
- ✅ Clean production build

### Test Mirroring from framer-motion v11.11.11 (36%)
- ✅ **63/176 test files mirrored:**
  - Animation System (19 files)
  - Components (7 files)
  - Context, Easing, Events, Frameloop (7 files)
  - Gestures (9 files)
  - Motion Core (21 files)

- **Remaining: 113 test files**
  - Projection tests (11 files)
  - Render tests (12 files)
  - Utility tests (22 files)
  - Value tests (8 files)
  - Cypress E2E tests (33 files)
  - Jest config files (2 files)

### Documentation
- ✅ Created MOTION_TEST_STRUCTURE_REPORT.md (complete test inventory)
- ✅ Test files include source attribution headers
- ✅ TODO comments for React→Svelte 5 conversion

---

## 🚧 In Progress / TODO

### 1. Complete Test Mirroring (113 files remaining)

**Projection Tests (11 files):**
- `/src/projection/animation/__tests__/mix-values.test.ts`
- `/src/projection/geometry/__tests__/` (5 files)
- `/src/projection/node/__tests__/` (3 files)
- `/src/projection/styles/__tests__/` (2 files)

**Render Tests (12 files):**
- `/src/render/dom/scroll/__tests__/index.test.ts`
- `/src/render/dom/utils/__tests__/` (4 files)
- `/src/render/dom/value-types/__tests__/value-types.test.ts`
- `/src/render/html/__tests__/use-props.test.ts`
- `/src/render/svg/__tests__/use-props.test.ts`
- `/src/render/utils/__tests__/` (4 files)

**Utility Tests (22 files):**
- All files in `/src/utils/__tests__/`

**Value Tests (8 files):**
- `/src/value/__tests__/` (7 files)
- `/src/value/types/__tests__/index.test.ts`

**Cypress E2E Tests (33 files):**
- `/cypress/integration/` (30 files)
- `/cypress/integration-html/` (2 files)
- `/cypress/integration-rsc/` (1 file)

**Test Configuration (2 files):**
- `jest.config.json`
- `jest.setup.tsx`

---

### 2. Svelte 5 Enhancements

#### A. UseRenderer Improvements
**Goal:** Make UseRender.svelte use `svelte:element` directly when Component is a string

**Current:**
```svelte
<!-- UseRender.svelte -->
<svelte:component
  this={Component === "SVG" ? UseSVGProps : UseHTMLProps}
>
```

**Proposed:**
```svelte
{#if typeof Component === 'string'}
  <svelte:element
    this={Component}
    {...visualProps}
    use:motion
  >
    <slot />
  </svelte:element>
{:else}
  <svelte:component this={Component} {...visualProps}>
    <slot />
  </svelte:component>
{/if}
```

**Benefits:**
- Fewer intermediate components
- Direct element rendering
- Better performance

---

#### B. measurePop as Attachment (Action)
**Goal:** Create a reusable action for measuring pop child elements

**Usage:**
```svelte
<div use:measurePop>
  <!-- Motion component child -->
</div>
```

**Implementation:**
```typescript
// actions/measurePop.ts
export function measurePop(node: HTMLElement) {
  // Clone/copy child motion element for measurements
  // Attach measurement logic
  return {
    update() {},
    destroy() {}
  };
}
```

---

#### C. motionRef as Attachment (Action)
**Goal:** Convert motionRef to an action pattern

**Current:** Function-based ref pattern
**Proposed:** Action-based pattern

```typescript
// actions/motionRef.ts
export function motionRef(node: HTMLElement, visualElement: VisualElement) {
  // Attach visual element to node
  visualElement.mount(node);

  return {
    update(newVisualElement: VisualElement) {
      // Handle updates
    },
    destroy() {
      visualElement.unmount();
    }
  };
}
```

**Usage:**
```svelte
<div use:motionRef={visualElement}>
```

---

#### D. AnimatePresence with Each/If Blocks
**Goal:** Make AnimatePresence work seamlessly with Svelte control flow

**Current:** Requires `list` prop
**Proposed:** Auto-detect children from `{#each}` and `{#if}` blocks

**Example:**
```svelte
<AnimatePresence>
  {#each items as item (item.id)}
    <motion.div>
      {item.name}
    </motion.div>
  {/each}
</AnimatePresence>
```

**Implementation Strategy:**
1. Detect motion components in slot content
2. Track mount/unmount via context
3. Apply presence animations automatically

---

#### E. Motion Components as Children
**Goal:** Recognize when children are motion components in measurePop/AnimatePresence

**Detection:**
```typescript
function isMotionComponent(component: any): boolean {
  return component?.$$?.type === Motion ||
         component?.$$?.props?.isSVG !== undefined;
}
```

**Auto-wrap non-motion children:**
```svelte
{#if isMotionComponent(child)}
  {@render child()}
{:else}
  <motion.div>
    {@render child()}
  </motion.div>
{/if}
```

---

#### F. motion[stringKey] Support
**Goal:** Allow dynamic motion component creation via string keys

**Current:** Only `motion.div`, `motion.button` work
**Proposed:** `motion[tagName]` support

**Example:**
```typescript
const tagName = 'div';
const Component = motion[tagName]; // Should work
```

**Implementation:**
Update motion-proxy.ts to handle string indexing:

```typescript
function createMotionProxy(features) {
  return new Proxy({} as any, {
    get(_target, key: string | symbol) {
      if (typeof key === 'symbol') return undefined;

      // Existing proxy logic...
      return createMotionComponent(key);
    }
  });
}
```

---

### 3. Test Infrastructure Updates

#### Convert React Tests to Svelte 5
**High Priority (Core Functionality):**
- Animation tests (19 files)
- Gesture tests (9 files)
- Value tests (8 files)

**Medium Priority (Platform-Specific):**
- Projection tests (11 files)
- Render tests (12 files)
- Utility tests (22 files)

**Low Priority (Complete Rewrite):**
- Component tests (7 files) - Need Svelte component rewrites
- SSR tests - Adapt for SvelteKit

#### Jest → Vitest Migration
1. Add Vitest-compatible type declarations
2. Convert `jest.fn()` to `vi.fn()`
3. Convert `jest.mock()` to `vi.mock()`
4. Update test setup files

#### Cypress → Playwright Migration
1. Convert 33 Cypress E2E tests to Playwright
2. Update selectors and assertions
3. Add SvelteKit-specific SSR tests

---

## 📊 Progress Tracking

| Category | Files Complete | Files Total | Progress |
|----------|---------------|-------------|----------|
| **Test Mirroring** | 63 | 176 | 36% |
| **Svelte 5 Features** | 0 | 6 | 0% |
| **Test Conversion** | 0 | 143 | 0% |
| **E2E Tests** | 5 | 33 | 15% |

---

## 🎯 Recommended Order

### Phase 1: Complete Test Mirroring (1-2 hours)
1. Mirror Projection tests (11 files)
2. Mirror Render tests (12 files)
3. Mirror Utility tests (22 files)
4. Mirror Value tests (8 files)
5. Mirror Cypress tests (33 files)
6. Commit all mirrored tests

### Phase 2: Svelte 5 Enhancements (2-3 hours)
1. Implement motion[stringKey] support (30 min)
2. Create measurePop action (30 min)
3. Create motionRef action (30 min)
4. Update UseRenderer with svelte:element (30 min)
5. Enhance AnimatePresence for blocks (1 hour)
6. Test and commit enhancements

### Phase 3: Test Infrastructure (3-4 hours)
1. Add Vitest type declarations
2. Convert high-priority tests (Animation, Gestures, Value)
3. Update test setup
4. Ensure 100% test pass rate

### Phase 4: Documentation (1 hour)
1. Update README with Svelte 5 examples
2. Create migration guide
3. Document new attachment patterns
4. Add API reference

---

## 🐛 Known Issues

### Test Errors (Expected)
- **2142 TypeScript errors** from mirrored React test files
- All errors are in `__tests__` directories
- Source code has **0 errors** ✅
- Production build is **clean** ✅

### Warnings
- **61 warnings** about reactive state references
- Non-blocking, can be addressed incrementally

---

## 📝 Notes

- All mirrored test files include attribution headers
- Test files preserve original framer-motion v11.11.11 logic
- React → Svelte conversion will happen in Phase 3
- Core library is production-ready (100% internalized, 0 errors)

---

**Last Updated:** 2025-12-27
**Session:** claude/motion-svelte5-runes-port-8LTS0
**Status:** Dependencies 100% internalized, Tests 36% mirrored, Enhancements pending
