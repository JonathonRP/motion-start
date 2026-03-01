/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { RefObject } from './safe-react-types';
import { inView, type InViewOptions } from '../render/dom/viewport';

export interface UseInViewOptions extends Omit<InViewOptions, 'root' | 'amount'> {
	root?: RefObject<Element>;
	once?: boolean;
	amount?: 'some' | 'all' | number;
}

export function useInView(ref: RefObject<Element>, { root, margin, amount, once = false }: UseInViewOptions = {}) {
	let isInView = $state(false);

	$effect(() => {
		if (!ref.current || (once && isInView)) return;

		const onEnter = () => {
			isInView = true;

			return once ? undefined : () => (isInView = false);
		};

		const options: InViewOptions = {
			root: (root && root.current) || undefined,
			margin,
			amount,
		};

		return inView(ref.current, onEnter, options);
	});

	return isInView;
}
