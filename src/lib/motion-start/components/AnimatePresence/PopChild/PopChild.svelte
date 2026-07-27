<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { useMotionConfigContext } from '../../../context/MotionConfigContext.svelte.js';
import type { Props } from './types.js';
import { usePresenceContext } from '../../../context/PresenceContext.svelte.js';
import { applyPopLayout } from './pop-layout.js';

let { isPresent, children }: Props = $props();

const id = $props.id();
const { nonce } = $derived(useMotionConfigContext());
const presenceContext = usePresenceContext();

// Keep a handle to the injected popLayout style so it can be removed when
// the node becomes present again or the effect is torn down.
let removePopLayout: VoidFunction | undefined;

function removeStyle() {
	removePopLayout?.();
	removePopLayout = undefined;
}

// measurePop is invoked while the exiting node is still in normal flow.
// offsetTop/offsetLeft therefore give the correct parent-relative position
// to pin once the element is switched to position:absolute.
$effect(() => {
	const context = presenceContext;
	if (!context) return;
	context.measurePop = (node) => {
		if (isPresent) return;

		removeStyle();
		removePopLayout = applyPopLayout(node, nonce);
	};
	return () => {
		context.measurePop = undefined;
		removeStyle();
	};
});

// Clear the temporary absolute-positioning rule once the element is present again.
$effect(() => {
	if (isPresent) {
		removeStyle();
	}
});
</script>

{@render children()}
