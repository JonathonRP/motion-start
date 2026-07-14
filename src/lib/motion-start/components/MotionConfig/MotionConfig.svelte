<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { setMotionConfigContext, useMotionConfigContext } from '../../context/MotionConfigContext.svelte';
import type { MotionConfigProps } from './index.js';
import { loadExternalIsValidProp } from '../../render/dom/utils/filter-props.js';
import type { Snippet } from 'svelte';

interface Props extends MotionConfigProps {
	children: Snippet;
}

let { isValidProp, children, ...config }: Props = $props();
const parentConfig = useMotionConfigContext();

$effect(() => {
	if (isValidProp) loadExternalIsValidProp(isValidProp);
});

/**
 * Inherit props from any parent MotionConfig components.
 */
const context = {
	get transformPagePoint() {
		return config.transformPagePoint ?? parentConfig.transformPagePoint;
	},
	get isStatic() {
		return config.isStatic ?? parentConfig.isStatic ?? false;
	},
	get transition() {
		return config.transition ?? parentConfig.transition;
	},
	get reducedMotion() {
		return config.reducedMotion ?? parentConfig.reducedMotion;
	},
	get nonce() {
		return config.nonce ?? parentConfig.nonce;
	},
};

setMotionConfigContext(context);
</script>

{@render children?.()}
