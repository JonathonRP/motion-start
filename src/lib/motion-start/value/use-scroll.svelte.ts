/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createScrollMotionValues } from './scroll/utils';
import type { RefObject } from '../utils/safe-react-types';
import { warning } from '../utils/errors';
import { scroll } from '../render/dom/scroll';
import type { ScrollInfoOptions } from '../render/dom/scroll/types';

export interface UseScrollOptions extends Omit<ScrollInfoOptions, 'container' | 'target'> {
	container?: RefObject<HTMLElement>;
	target?: RefObject<HTMLElement>;
	layoutEffect?: boolean;
}

function refWarning(name: string, ref?: RefObject<HTMLElement>) {
	warning(
		Boolean(!ref || ref.current),
		`You have defined a ${name} options but the provided ref is not yet hydrated, probably because it's defined higher up the tree. Try calling useScroll() in the same component as the ref, or setting its \`layoutEffect: false\` option.`
	);
}

export function useScroll({ container, target, layoutEffect = true, ...options }: UseScrollOptions = {}) {
	const values = createScrollMotionValues();

	$effect.pre(() => {
		refWarning('target', target);
		refWarning('container', container);

		return scroll(
			(_progress, { x, y }) => {
				values.scrollX.set(x.current);
				values.scrollXProgress.set(x.progress);
				values.scrollY.set(y.current);
				values.scrollYProgress.set(y.progress);
			},
			{
				...options,
				container: container?.current || undefined,
				target: target?.current || undefined,
			}
		);
	});

	return values;
}
