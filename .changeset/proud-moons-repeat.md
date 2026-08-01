---
'motion-start': patch
---

Stop `Reorder.Item` discarding a caller-supplied `layoutDependency`.

`Reorder.Item` set `layoutDependency={orderVersion}` *after* the `{...props}` spread, so any
`layoutDependency` passed by the caller was silently overwritten by the group's internal order
version. That is also redundant: `MeasureLayout` already folds the group's `orderVersion` into an
*ambient* layout version, which adds snapshot opportunities rather than replacing the user's own
dependency. A board that moves items between groups needs its own `layoutDependency` to reach the
item, so the prop is now left alone.

Also adds regression coverage for a shared `layoutId` element that unmounts from one parent and
mounts into another in the same update: unit tests for the projection handover in both commit
orders (outgoing destroyed first, incoming created first), and a Cypress spec that samples the
element's position per animation frame to assert it animates between the two parents instead of
teleporting.
