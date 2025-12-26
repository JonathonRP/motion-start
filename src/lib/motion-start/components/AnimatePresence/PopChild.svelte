<!--
PopChild component for AnimatePresence popLayout mode
Based on framer-motion@11.11.11
Measures element dimensions before removal and preserves layout space
-->

<script lang="ts">
import { useMotionConfig } from '../../context/motion-config-context.svelte.js';

interface Size {
	width: number;
	height: number;
	top: number;
	left: number;
}

let {
	children,
	isPresent = $bindable(),
}: {
	children: any;
	isPresent: boolean;
} = $props();

let childRef = $state<HTMLElement | null>(null);
let size = $state<Size>({
	width: 0,
	height: 0,
	top: 0,
	left: 0,
});
let popId = $state(`pop-${Math.random().toString(36).substr(2, 9)}`);
let prevIsPresent = $state(isPresent);
let styleElement = $state<HTMLStyleElement | null>(null);

const config = useMotionConfig();

// Measure before unmount (like getSnapshotBeforeUpdate)
$effect(() => {
	if (prevIsPresent && !isPresent && childRef) {
		size = {
			width: childRef.offsetWidth || 0,
			height: childRef.offsetHeight || 0,
			top: childRef.offsetTop,
			left: childRef.offsetLeft,
		};
	}
	prevIsPresent = isPresent;
});

// Apply styles when element is exiting (like useInsertionEffect)
$effect(() => {
	const { width, height, top, left } = size;

	if (isPresent || !childRef || !width || !height) {
		// Clean up existing style
		if (styleElement) {
			document.head.removeChild(styleElement);
			styleElement = null;
		}
		return;
	}

	// Element is exiting, apply absolute positioning
	childRef.dataset.motionPopId = popId;

	const style = document.createElement('style');
	if (config.nonce) {
		style.nonce = config.nonce;
	}
	document.head.appendChild(style);
	styleElement = style;

	if (style.sheet) {
		style.sheet.insertRule(`
                [data-motion-pop-id="${popId}"] {
                    position: absolute !important;
                    width: ${width}px !important;
                    height: ${height}px !important;
                    top: ${top}px !important;
                    left: ${left}px !important;
                }
            `);
	}

	return () => {
		if (styleElement && styleElement.parentNode) {
			document.head.removeChild(styleElement);
		}
	};
});
</script>

<div bind:this={childRef}>
    {@render children()}
</div>
