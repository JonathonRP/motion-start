---
"motion-start": patch
---

Fix animation replay and playback speed correctness.

- A finished `MainThreadAnimation` can be replayed again: `play()` now rebases `startTime` on the current time before falling back to the animation's creation time, which previously made a replayed animation finish instantly.
- `speed = -1` now plays a finished animation backwards. `play()` offsets `startTime` by the animation's duration when replaying in reverse, and changing `speed` brings the current time up to date before rebasing.
- Animations that finish while reversed or at a non-default speed now commit the correct terminal keyframe. `getFinalKeyframe` accepts the playback speed and returns the first keyframe when the speed is negative, and both the WAAPI (`AcceleratedAnimation`) and mini (`NativeAnimation`) paths pass it through.
