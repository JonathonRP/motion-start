<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes={true} />

<script lang="ts">
import { onMount } from 'svelte';
import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import { setMotionOutroContext } from '../../context/OutroContext.svelte.js';
import { createReactiveInvalidation } from '../../utils/reactive-invalidation.js';
import PresenceChild from './PresenceChild/PresenceChild.svelte';
import type { AnimatePresenceProps } from './types.js';

let {
	custom,
	initial = true,
	onExitComplete,
	mode = 'sync',
	presenceAffectsLayout = true,
	children,
}: AnimatePresenceProps = $props();

const motionConfig = useMotionConfigContext();
let activeOutros = 0;
let waitUntil = 0;
const exitWaiters: VoidFunction[] = [];
const layoutInvalidation = createReactiveInvalidation();
let isInitialRender = $state(true);

onMount(() => {
	isInitialRender = false;
});

setMotionOutroContext({
	get custom() {
		return custom;
	},
	get mode() {
		return mode;
	},
	get nonce() {
		return motionConfig.nonce;
	},
	get presenceAffectsLayout() {
		return presenceAffectsLayout;
	},
	begin() {
		if (presenceAffectsLayout) layoutInvalidation.invalidate();
		activeOutros++;
		let completed = false;

		return (_id, completedExit = true) => {
			if (completed) return;
			completed = true;
			activeOutros--;
			if (presenceAffectsLayout) layoutInvalidation.invalidate();
			if (activeOutros === 0) {
				for (const resolve of exitWaiters.splice(0)) resolve();
				if (completedExit) onExitComplete?.();
			}
		};
	},
	reserve(duration) {
		waitUntil = Math.max(waitUntil, performance.now() + duration);
	},
	remaining() {
		return Math.max(0, waitUntil - performance.now());
	},
	waitForExit() {
		return activeOutros === 0 ? Promise.resolve() : new Promise<void>((resolve) => exitWaiters.push(resolve));
	},
});
</script>

<!--
PresenceChild remains the shared initial/custom/registration boundary. Individual
motion elements become their own exiting presence child through the outro bridge,
because Svelte's keyed blocks own their identity and DOM lifetime.
-->
<PresenceChild
	mode="sync"
	isPresent={true}
	initial={initial === false && isInitialRender ? false : undefined}
	{custom}
	{presenceAffectsLayout}
	presenceLayoutInvalidation={layoutInvalidation}
>
	{@render children?.()}
</PresenceChild>
