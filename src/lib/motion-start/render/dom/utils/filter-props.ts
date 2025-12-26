/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from '../../../motion/types';
import { isValidMotionProp } from '../../../motion/utils/valid-prop.js';

let shouldForward = (key: string) => !isValidMotionProp(key);

export type IsValidProp = (key: string) => boolean;

/**
 * Load an external prop validator (e.g., from @emotion/is-prop-valid)
 * @public
 */
export function loadExternalIsValidProp(isValidProp?: IsValidProp) {
	if (!isValidProp) return;

	// Explicitly filter our events
	shouldForward = (key: string) => (key.startsWith('on') ? !isValidMotionProp(key) : isValidProp(key));
}
function filterProps(props: MotionProps, isDom: boolean, forwardMotionProps: boolean) {
	var filteredProps = {};
	for (var key in props) {
		if (
			shouldForward(key) ||
			(forwardMotionProps === true && isValidMotionProp(key)) ||
			(!isDom && !isValidMotionProp(key))
		) {
			//@ts-expect-error
			filteredProps[key] = props[key];
		}
	}
	return filteredProps;
}

export { filterProps };
