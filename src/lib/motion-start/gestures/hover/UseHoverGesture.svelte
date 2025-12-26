<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import type { Snippet } from 'svelte';
import { useHoverGesture } from './use-hover-gesture.svelte.js';

interface Props {
	props: any;
	visualElement: any;
	isCustom?: any;
	children?: Snippet;
}

let { props, visualElement, children }: Props = $props();

// Use the function-based API
useHoverGesture(() => visualElement, () => props);
</script>

{@render children?.()}
