<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { watch } from 'runed';
import {
	createMotionConfigContext,
	setMotionConfigContext,
	useMotionConfigContext,
} from '../../context/MotionConfigContext.svelte.js';
import type { MotionConfigProps } from './index.js';
import { loadExternalIsValidProp } from '../../render/dom/utils/filter-props.js';

let { isValidProp, children, ...config }: MotionConfigProps = $props();
const parentConfig = useMotionConfigContext();

watch([() => isValidProp], ([nextIsValidProp]) => {
	if (nextIsValidProp) loadExternalIsValidProp(nextIsValidProp);
});

/**
 * Inherit props from any parent MotionConfig components.
 */
const context = createMotionConfigContext(parentConfig.config, () => ({
	transformPagePoint: config.transformPagePoint ?? parentConfig.transformPagePoint,
	isStatic: config.isStatic ?? parentConfig.isStatic ?? false,
	transition: config.transition ?? parentConfig.transition,
	reducedMotion: config.reducedMotion ?? parentConfig.reducedMotion,
	nonce: config.nonce ?? parentConfig.nonce,
}));

setMotionConfigContext(context);
</script>

{@render children?.()}
