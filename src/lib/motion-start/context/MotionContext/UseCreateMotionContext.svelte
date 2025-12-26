<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { getContext } from 'svelte';
import { MOTION_CONTEXT_KEY, MotionContext, type MotionContextProps } from './index.js';
import { getCurrentTreeVariants } from './utils.js';

let { props, isStatic, isCustom = undefined } = $props();

let mc = MotionContext.get();

let { initial, animate } = $derived(getCurrentTreeVariants(props, mc));

const variantLabelsAsDependency = (prop: string | boolean | any[] | undefined) => {
	return Array.isArray(prop) ? prop.join(' ') : prop;
};

const memo = (
	variantLabelsAsDependency?: string | boolean | undefined,
	variantLabelsAsDependency2?: string | boolean | undefined
) => {
	return { initial: initial, animate: animate };
};

/**
 * Only break memoisation in static mode
 */
let value = $derived(isStatic ? memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)) : memo());
</script>

<slot {value} />
