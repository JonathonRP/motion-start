<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { useMotionConfigContext } from '../../../context/MotionConfigContext.svelte';
import type { Props } from './types';
import { usePresenceContext } from '../../../context/PresenceContext.svelte';

let { isPresent, children }: Props = $props();

const id = $props.id();
const { nonce } = $derived(useMotionConfigContext());
const presenceContext = usePresenceContext();

// Keep a handle to the injected popLayout style so it can be removed when
// the node becomes present again or the effect is torn down.
let injectedStyle: HTMLStyleElement | null = null;

function removeStyle() {
	if (injectedStyle && document.head.contains(injectedStyle)) {
		document.head.removeChild(injectedStyle);
		injectedStyle = null;
	}
}

// measurePop is invoked while the exiting node is still in normal flow.
// offsetTop/offsetLeft therefore give the correct parent-relative position
// to pin once the element is switched to position:absolute.
$effect(() => {
	const context = presenceContext;
	if (!context) return;
	context.measurePop = (node) => {
		const child = node as HTMLElement;
		if (!child) return;

		// offsetTop/offsetLeft are already relative to the offset parent, so the
		// generated absolute rule stays correct even if the page scrolls.
		const width = child.offsetWidth;
		const height = child.offsetHeight;
		const top = child.offsetTop;
		const left = child.offsetLeft;

		removeStyle();
		child.dataset.motionPopId = id;

		const style = document.createElement('style');
		if (nonce) style.nonce = nonce;
		document.head.appendChild(style);
		injectedStyle = style;

		if (style.sheet) {
			style.sheet.insertRule(
				`[data-motion-pop-id="${id}"] { position: absolute !important; width: ${width}px !important; height: ${height}px !important; top: ${top}px !important; left: ${left}px !important; }`
			);
		}
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
