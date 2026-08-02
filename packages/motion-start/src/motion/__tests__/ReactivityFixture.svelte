<svelte:options runes={true} />

<script lang="ts">
import { ProbeMotion, probeStyle, probeVariants } from './probe-motion-component.svelte.js';

let variant = $state('visible');
</script>

<button id="change-variant" onclick={() => (variant = variant === "visible" ? "hidden" : "visible")}
	>change variant</button
>

<ProbeMotion animate={variant} variants={probeVariants} style={probeStyle} />
