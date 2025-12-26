<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { MotionConfigContext } from '../../context/MotionConfigContext.js';
import { loadExternalIsValidProp } from '../../render/dom/utils/filter-props.js';
import type { MotionConfigProps } from './index.js';

interface Props extends MotionConfigProps {}

let { isValidProp, children, ...configure }: Props = $props();

isValidProp && loadExternalIsValidProp(isValidProp);

// Get parent config (returns default if no parent context)
const parentConfig = MotionConfigContext.get();

/**
 * Inherit props from any parent MotionConfig components
 */
let config = $state({
	...parentConfig,
	...configure,
});

/**
 * Update config when props change
 */
$effect(() => {
	config = {
		...parentConfig,
		...configure,
	};
});

/**
 * Provide config to children
 */
$effect(() => {
	MotionConfigContext.set(config);
});
</script>

{@render children?.()}
