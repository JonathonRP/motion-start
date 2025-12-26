<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { useFocusGesture } from './focus/use-focus-gesture.svelte.js';
import { useHoverGesture } from './hover/use-hover-gesture.svelte.js';
import { usePanGesture } from './pan/use-pan-gesture.svelte.js';
import { useTapGesture } from './press/use-tap-gesture.svelte.js';

let { props, visualElement }: { props: any; visualElement: any } = $props();

// Initialize all gesture hooks
usePanGesture(() => visualElement, () => props);
useTapGesture(() => visualElement, () => props);
useHoverGesture(() => visualElement, () => props);
useFocusGesture(() => visualElement, () => props);
</script>

<slot />
