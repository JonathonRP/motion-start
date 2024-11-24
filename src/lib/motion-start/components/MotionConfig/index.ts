/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { Snippet } from 'svelte';
import type { MotionConfigContext } from '../../context/MotionConfigContext';
import type { IsValidProp } from '../../render/dom/utils/filter-props';

export interface MotionConfigProps extends Partial<MotionConfigContext> {
	children?: Snippet;
	isValidProp?: IsValidProp;
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
