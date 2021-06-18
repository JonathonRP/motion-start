/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { SvelteComponentTyped } from "svelte";
import { MotionConfigContextObject } from "../../context/MotionConfigContext";
export declare type MotionConfigProps = Partial<MotionConfigContextObject> 
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
export declare class MotionConfig extends SvelteComponentTyped<MotionConfigProps,{},{default:{}}> { }

