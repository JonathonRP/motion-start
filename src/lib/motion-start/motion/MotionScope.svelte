<svelte:options runes={true} />

<script lang="ts">
/**
 * Opens a Svelte component context for a motion component.
 *
 * Motion components are hand-written component functions rather than compiled
 * `.svelte` modules, so Svelte never opens a component context for them. Without
 * one, `setContext` writes into the nearest compiled ancestor's context map,
 * which every sibling motion component shares. Contexts then leak sideways in
 * mount order: a variant parent adopts only its first child, and each later
 * child parents to the previous sibling instead of the parent.
 *
 * Running the motion body inside this component's initialisation gives it the
 * scope — and the effect ownership — a compiled component would have had.
 */
import { untrack } from 'svelte';

let { run }: { run: () => void } = $props();

// Initialising exactly once is the point: this component exists purely to open
// a context scope, so the motion body must not re-run when props change.
untrack(() => run)();
</script>
