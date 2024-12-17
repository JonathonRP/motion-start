/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionComponentConfig } from '../../motion/index.svelte';
import type { SVGRenderState } from './types';
import { renderSVG } from './utils/render.svelte';
import { scrapeMotionValuesFromProps as scrapeSVGProps } from './utils/scrape-motion-values.svelte';
import { makeUseVisualState } from '../../motion/utils/use-visual-state.svelte';
import { createSvgRenderState } from './utils/create-render-state.svelte';
import { buildSVGAttrs } from './utils/build-attrs.svelte';
import { isSVGTag } from './utils/is-svg-tag';
import { frame } from '../../frameloop/frame.svelte';
import type { ScrapeMotionValuesFromProps } from '../types';

export const svgMotionConfig: Partial<MotionComponentConfig<SVGElement, SVGRenderState>> = {
	useVisualState: makeUseVisualState({
		scrapeMotionValuesFromProps: scrapeSVGProps as ScrapeMotionValuesFromProps,
		createRenderState: createSvgRenderState,
		onMount: (props, instance, { renderState, latestValues }) => {
			frame.read(() => {
				try {
					renderState.dimensions =
						typeof (instance as SVGGraphicsElement).getBBox === 'function'
							? (instance as SVGGraphicsElement).getBBox()
							: (instance.getBoundingClientRect() as DOMRect);
				} catch (e) {
					// Most likely trying to measure an unrendered element under Firefox
					renderState.dimensions = {
						x: 0,
						y: 0,
						width: 0,
						height: 0,
					};
				}
			});

			frame.render(() => {
				buildSVGAttrs(renderState, latestValues, isSVGTag(instance.tagName), props.transformTemplate);

				renderSVG(instance, renderState);
			});
		},
	}),
} satisfies Partial<MotionComponentConfig<SVGElement, SVGRenderState>>;
