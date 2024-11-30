/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { get } from 'svelte/store';
import { usePresence } from '../../../components/AnimatePresence/use-presence';
import { useContext } from '../../../context/utils/context.svelte';
import { LayoutGroupContext } from '../../../context/LayoutGroupContext';
import { SwitchLayoutGroupContext } from '../../../context/SwitchLayoutGroupContext';
import type { MotionProps } from '../../types';
import type { VisualElement } from '../../../render/VisualElement';
import { default as MeasureLayoutWithContext } from './MeasureLayoutWithContext.svelte';
import type { Component } from 'svelte';

interface MeasureContextProps {
	layoutGroup: LayoutGroupContext;
	switchLayoutGroup?: SwitchLayoutGroupContext;
	isPresent: boolean;
	safeToRemove?: VoidFunction | null;
}

export type MeasureProps = MotionProps & MeasureContextProps & { visualElement: VisualElement<unknown> };

export function MeasureLayout(
	...[anchor, { isCustom = false, ...props }]: Parameters<
		Component<MotionProps & { visualElement: VisualElement<unknown>; isCustom?: boolean }>
	>
): ReturnType<Component<MotionProps>> {
	const [isPresent, safeToRemove] = get(usePresence(isCustom));
	const layoutGroup = get(useContext(LayoutGroupContext, isCustom));
	return MeasureLayoutWithContext(anchor, {
		...props,
		layoutGroup,
		switchLayoutGroup: get(useContext(SwitchLayoutGroupContext, isCustom)),
		isPresent,
		safeToRemove,
	});

	// return new Proxy({} as Component<MotionProps>, {
	// 	get: (_target, _key, args) => {
	// 		if (!args[1]) {
	// 			args[1] = {
	// 				...props,
	// 				layoutGroup,
	// 				switchLayoutGroup: get(SwitchLayoutGroupContext(isCustom)),
	// 				isPresent,
	// 				safeToRemove,
	// 			};
	// 		} else {
	// 			args[1] = {
	// 				...args[1],
	// 				...props,
	// 				layoutGroup,
	// 				switchLayoutGroup: get(SwitchLayoutGroupContext(isCustom)),
	// 				isPresent,
	// 				safeToRemove,
	// 			};
	// 		}

	// 		// @ts-expect-error
	// 		return MeasureLayoutWithContext(...args);
	// 	},
	// });
}
