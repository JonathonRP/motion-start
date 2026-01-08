<script lang="ts">
	/**
	 * MotionConfig Component
	 *
	 * Provides global animation configuration to all motion attachments
	 *
	 * @example
	 * ```svelte
	 * <MotionConfig transition={{ type: 'spring', stiffness: 200 }} reducedMotion="user">
	 *   <App />
	 * </MotionConfig>
	 * ```
	 */

	import type { Snippet } from 'svelte';
	import type { TransitionOptions } from '../animation/types.js';
	import { setMotionConfig, type MotionConfigValue } from '../context/motion-config.svelte.js';

	type Props = {
		/** Default transition for all animations */
		transition?: TransitionOptions;
		/** Reduce motion setting: 'user' | 'always' | 'never' */
		reducedMotion?: 'user' | 'always' | 'never';
		/** Transform page point for nested scroll containers */
		transformPagePoint?: (point: { x: number; y: number }) => { x: number; y: number };
		/** Whether animations should be disabled (static) */
		isStatic?: boolean;
		/** Children */
		children: Snippet;
	};

	let { transition, reducedMotion, transformPagePoint, isStatic, children }: Props = $props();

	// Set context with current values
	$effect.pre(() => {
		setMotionConfig({
			transition,
			reducedMotion,
			transformPagePoint,
			isStatic
		});
	});
</script>

{@render children()}
