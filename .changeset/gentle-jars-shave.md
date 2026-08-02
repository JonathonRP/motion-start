---
"motion-start": patch
---

Fix finished promises being recreated the instant an animation completes, which made anything awaiting or chaining a controls object after completion hang forever. The finished promise is now only recreated when a finished animation is replayed, animations expose a `finished` getter that is read fresh on every `then()`, and `GroupPlaybackControls` awaits its members' own `finished` promises (falling back to the member itself for controls that don't expose one) instead of consuming them as one-shot thenables. Empty groups still resolve immediately.
