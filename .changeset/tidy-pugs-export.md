---
'motion-start': patch
---

Export the `HTMLMotionProps` type from the package root.

`HTMLMotionProps<Tag>` is the props type behind every `motion.*` HTML component and is part of
framer-motion's public API, but it was declared in `render/html/types.ts` without being re-exported
from any entry point. Consumers writing wrapper components around `motion.div`, `motion.button` and
friends had no way to name the props they were forwarding.

The root entry now re-exports it alongside `ForwardRefComponent`, matching upstream. A type-level
test imports it from the public entry the way a consumer would, so the export cannot silently
regress.
