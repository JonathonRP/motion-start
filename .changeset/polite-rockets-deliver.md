---
"motion-start": minor
---

Rewrite the library against `framer-motion@11.11.11` (previously `4.0.3`) on Svelte 5 runes.

**New**

- `Reorder.Group` / `Reorder.Item` for drag-to-reorder lists.
- `LayoutGroup` and the full projection engine, replacing `AnimateSharedLayout`.
- `AnimatePresence` `mode` (`sync` | `wait` | `popLayout`) and `usePresenceData`.
- WAAPI-accelerated animations, `animate()` sequences, and `stagger()`.
- Scroll (`useScroll`), viewport (`whileInView`), and `useInView` support.
- Motion value hooks: `useTime`, `useVelocity`, `useWillChange`, `useAnimate`, `useAnimateMini`.
- Subpath entries: `motion-start/dom`, `/mini`, `/m`, `/client`, `/projection`.

**Changed**

- Components and hooks are Svelte 5 runes-based; renderless `Use*.svelte` wrappers are gone in favour of plain functions and classes.
- `motion` / `m` are proxies, so any element is available as `motion.<tag>`.
- Gestures rewritten onto the shared `Feature` pipeline (hover, press, pan, drag, focus).

**Removed**

- `AnimateSharedLayout` — use `LayoutGroup` with `layoutId`.
- `MotionDiv` — use `motion.div`.
