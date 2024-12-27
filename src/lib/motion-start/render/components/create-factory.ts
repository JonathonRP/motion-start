/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { createRendererMotionComponent, type MotionComponentProps } from '../../motion/index.svelte';
import type { DOMMotionComponents } from '../dom/types';
import type { CreateVisualElement } from '../types';
import type { FeaturePackages } from '../../motion/features/types';
import { isSVGComponent } from '../dom/utils/is-svg-component';
import { svgMotionConfig } from '../svg/config-motion';
import { htmlMotionConfig } from '../html/config-motion';
import { createUseRender } from '../dom/use-render.svelte';
import type { Component, Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { MotionProps } from '$lib/motion-start/motion/types';

type MotionComponent<P extends MotionProps, TElement extends keyof SvelteHTMLElements> = Component<
	MotionComponentProps<
		P & { children?: Snippet; ref?: SvelteHTMLElements[TElement]['this'] } & Omit<SvelteHTMLElements[TElement], 'style'>
	>
>;

export function createMotionComponentFactory(
	preloadedFeatures?: FeaturePackages,
	createVisualElement?: CreateVisualElement<any>
) {
	return function createMotionComponent<
		Props extends MotionProps,
		TagName extends keyof DOMMotionComponents | string = 'div',
	>(Component: TagName | string, { forwardMotionProps } = { forwardMotionProps: false }) {
		const baseConfig = isSVGComponent(Component) ? svgMotionConfig : htmlMotionConfig;

		const config = {
			...baseConfig,
			preloadedFeatures,
			useRender: createUseRender(forwardMotionProps),
			createVisualElement,
			Component,
		};

		return createRendererMotionComponent(config as any) as MotionComponent<Props, TagName>;
	};
}
