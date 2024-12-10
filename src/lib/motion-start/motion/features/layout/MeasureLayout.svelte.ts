/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { fromStore, get } from 'svelte/store';
import { usePresence } from '../../../components/AnimatePresence/use-presence.svelte';
import { useContext } from '../../../context/utils/context.svelte';
import { LayoutGroupContext } from '../../../context/LayoutGroupContext';
import { SwitchLayoutGroupContext } from '../../../context/SwitchLayoutGroupContext';
import type { MotionProps } from '../../types';
import type { VisualElement } from '../../../render/VisualElement.svelte';
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
	...[anchor, _props]: Parameters<
		Component<MotionProps & { visualElement: VisualElement<unknown>; isCustom?: boolean }>
	>
): ReturnType<Component<MotionProps>> {
	const { isCustom = false, ...props } = $derived(_props);
	const [isPresent, safeToRemove] = fromStore(usePresence(isCustom)).current;
	const layoutGroup = fromStore(useContext(LayoutGroupContext, isCustom)).current;
	return MeasureLayoutWithContext(anchor, {
		...props,
		get layoutGroup() {
			return layoutGroup;
		},
		get switchLayoutGroup() {
			return fromStore(useContext(SwitchLayoutGroupContext, isCustom)).current;
		},
		get isPresent() {
			return isPresent;
		},
		get safeToRemove() {
			return safeToRemove;
		},
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
