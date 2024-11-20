/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { tick } from 'svelte';
import { animationControls } from './animation-controls';

/**
 * Creates `AnimationControls`, which can be used to manually start, stop
 * and sequence animations on one or more components.
 *
 * The returned `AnimationControls` should be passed to the `animate` property
 * of the components you want to animate.
 *
 * These components can then be animated with the `start` method.
 *
 * @library
 *
 * ```jsx
 * import * as React from 'react'
 * import { Frame, useAnimation } from 'framer'
 *
 * export function MyComponent(props) {
 *    const controls = useAnimation()
 *
 *    controls.start({
 *        x: 100,
 *        transition: { duration: 0.5 },
 *    })
 *
 *    return <Frame animate={controls} />
 * }
 * ```
 *
 * @motion
 *
 * ```jsx
 * import * as React from 'react'
 * import { motion, useAnimation } from 'framer-motion'
 *
 * export function MyComponent(props) {
 *    const controls = useAnimation()
 *
 *    controls.start({
 *        x: 100,
 *        transition: { duration: 0.5 },
 *    })
 *
 *    return <MotionDiv animate={controls} />
 * }
 * ```
 *
 * @returns Animation controller with `start` and `stop` methods
 *
 * @public
 */
export const useAnimationControls = () => {
	const controls = animationControls();

	(() => {
		const cleanup: any = {};
		tick().then((v) => (cleanup.clean = controls.mount()));
		return () => {
			cleanup.clean?.();
		};
	})();

	return controls;
};

export const useAnimation = useAnimationControls;
