/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { useMotionValueEvent } from '../../utils/use-motion-value-event';
import type { MotionValue } from '../../value';
import type { VisualElement } from '../VisualElement';

export function useMotionValueChild(
	children: MotionValue<number | string>,
	visualElement?: VisualElement<HTMLElement | SVGElement>
) {
	const render = children.get();

	useMotionValueEvent(children, 'change', (latest) => {
		if (visualElement && visualElement.current) {
			visualElement.current.textContent = `${latest}`;
		}
	});

	return render;
}
