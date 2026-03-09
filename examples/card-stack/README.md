# Card Stack Demo

An interactive card stack built with motion-start, demonstrating AnimatePresence with drag interactions.

## Features

- 🃏 **Swipeable Cards**: Drag cards left or right to dismiss
- 🎨 **Smooth Animations**: Exit animations follow drag direction
- 🔄 **Infinite Loop**: Cards cycle through the stack
- ✨ **AnimatePresence**: Orchestrates enter/exit animations

## How it works

The example shows a stack of cards where:
- The **front card** can be dragged horizontally
- Swiping left or right dismisses the card in that direction
- The **next card** is visible behind and animates forward
- Uses `useMotionValue` and `useTransform` for rotation during drag

## Running locally

```bash
npm install
npm run dev
```

## Running on StackBlitz

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/JonathonRP/motion-start/tree/main/examples/card-stack)

## Key Concepts

- **AnimatePresence**: Manages enter/exit animations
- **Drag Gestures**: `drag="x"` for horizontal dragging
- **Motion Values**: Track drag position in real-time
- **Transform**: Map drag distance to rotation
- **Exit Variants**: Custom exit based on swipe direction

## Learn more

- [motion-start documentation](https://github.com/JonathonRP/motion-start)
- Based on Framer Motion's animation patterns
