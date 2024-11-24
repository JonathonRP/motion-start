/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { get, type Writable } from 'svelte/store';
import { usePresence } from '../../../components/AnimatePresence/use-presence';
import { LayoutGroupContext, type LayoutGroupContextProps } from '../../../context/LayoutGroupContext';
import { SwitchLayoutGroupContext } from '../../../context/SwitchLayoutGroupContext';
import type { MotionProps } from '../../types';
import type { VisualElement } from '../../../render/VisualElement';
import { default as MeasureLayoutWithContext } from './MeasureLayoutWithContext.svelte';
import { getContext, type Component } from 'svelte';

interface MeasureContextProps {
	layoutGroup: LayoutGroupContextProps;
	switchLayoutGroup?: SwitchLayoutGroupContext;
	isPresent: boolean;
	safeToRemove?: VoidFunction | null;
}

export type MeasureProps = MotionProps & MeasureContextProps & { visualElement: VisualElement<unknown> };

export function MeasureLayout(props: MotionProps & { visualElement: VisualElement<unknown> }, isCustom = false) {
	const [isPresent, safeToRemove] = get(usePresence(isCustom));
	const layoutGroup = get(
		getContext<ReturnType<typeof LayoutGroupContext>>(LayoutGroupContext) || LayoutGroupContext(isCustom)
	);

	return new Proxy({} as Component<MotionProps>, {
		get: (_target, _key, args) => {
			if (!args[1]) {
				args[1] = {
					...props,
					layoutGroup,
					switchLayoutGroup: get(SwitchLayoutGroupContext(isCustom)),
					isPresent,
					safeToRemove,
				};
			} else {
				args[1] = {
					...args[1],
					...props,
					layoutGroup,
					switchLayoutGroup: get(SwitchLayoutGroupContext(isCustom)),
					isPresent,
					safeToRemove,
				};
			}

			// @ts-expect-error
			return MeasureLayoutWithContext(...args);
		},
	});
}
