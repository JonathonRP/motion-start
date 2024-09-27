/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionComponentConfig, MotionProps } from "../../motion";
import type { TargetProjection } from "../utils/state";
import type { SVGRenderState } from "./types";

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { buildSVGAttrs } from './utils/build-attrs.js';
import { createSvgRenderState } from './utils/create-render-state.js';
import { renderSVG } from './utils/render.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';

var svgMotionConfig = {
        //@ts-ignore
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
        createRenderState: createSvgRenderState,
        onMount: function (props:MotionProps, instance:SVGGraphicsElement, _a: { renderState: any; latestValues: any; }) {
            var renderState = _a.renderState, latestValues = _a.latestValues;
            try {
                renderState.dimensions =
                    typeof (instance as SVGGraphicsElement).getBBox ===
                        "function"
                        ? instance.getBBox()
                        : instance.getBoundingClientRect();
            }
            catch (e) {
                // Most likely trying to measure an unrendered element under Firefox
                renderState.dimensions = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                };
            }
            if (isPath(instance)) {
                //@ts-ignore
                renderState.totalPathLength = instance.getTotalLength();
            }
            buildSVGAttrs(renderState, latestValues, undefined, undefined, { enableHardwareAcceleration: false }, props.transformTemplate);
            // TODO: Replace with direct assignment
            renderSVG(instance, renderState);
        },
    } satisfies Partial<MotionComponentConfig<SVGElement, SVGRenderState>>
function isPath(element: SVGGraphicsElement) {
    return element.tagName === "path";
}

export { svgMotionConfig };

