# AnimatePresence - presenceAffectsLayout Demo

This example demonstrates the `presenceAffectsLayout` prop of the `AnimatePresence` component in motion-start.

## What is presenceAffectsLayout?

The `presenceAffectsLayout` prop controls how the layout updates when items are removed from an AnimatePresence:

- **`true` (default)**: Remaining items shift/animate to fill the space **during** the exit animation. The layout animation and exit animation happen simultaneously.

- **`false`**: Remaining items wait to shift/animate **after** the exiting item's animation completes. The layout is preserved during the exit animation.

## Try it out

1. Toggle the `presenceAffectsLayout` checkbox
2. Click "Remove" on any item
3. Notice the difference:
   - When **ON**: Items slide up immediately as the item starts exiting
   - When **OFF**: Items wait until the exiting item finishes its exit animation

## Running locally

```bash
npm install
npm run dev
```

## Running on StackBlitz

Click the button below to open this example on StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/JonathonRP/motion-start/tree/main/examples/presence-affects-layout)

## Features demonstrated

- ✅ AnimatePresence with dynamic list
- ✅ presenceAffectsLayout toggle
- ✅ Layout animations
- ✅ Enter/exit animations
- ✅ Adding and removing items

## Learn more

- [motion-start documentation](https://github.com/JonathonRP/motion-start)
- Based on Framer Motion's AnimatePresence
