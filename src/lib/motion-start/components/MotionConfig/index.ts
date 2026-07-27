/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import type { IsValidProp } from '../../render/dom/utils/filter-props.js';
import type { Snippet } from 'svelte';

export interface MotionConfigProps extends Partial<MotionConfigContext> {
	isValidProp?: IsValidProp;
	children?: Snippet;
}

/**
 * `MotionConfig` is used to set configuration options for all children `motion` components.
 *
 * ```jsx
 * import { MotionDiv, MotionConfig } from "svelte-motion"
 *
 * <MotionConfig transition={{ type: "spring" }}>
 *   <MotionDiv animate={{ x: 100 }} />
 * </MotionConfig>
 * ```
 *
 * @public
 */
export { default as MotionConfig } from './MotionConfig.svelte';
