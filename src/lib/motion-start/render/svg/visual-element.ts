/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
// export declare const svgVisualElement: ({ parent, props, presenceId, blockInitialAnimation, visualState, }: import("../types").VisualElementOptions<SVGElement, any>, options?: DOMVisualElementOptions) => import("../types").VisualElement<SVGElement, any>;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { __assign } from 'tslib';
import { camelToDash } from '../dom/utils/camel-to-dash.js';
import { getDefaultValueType } from '../dom/value-types/defaults.js';
import { buildLayoutProjectionTransform, buildLayoutProjectionTransformOrigin } from '../html/utils/build-projection-transform.js';
import { isTransformProp } from '../html/utils/transform.js';
import { htmlConfig } from '../html/visual-element.js';
import { visualElement } from '../index.js';
import { buildSVGAttrs } from './utils/build-attrs.js';
import { camelCaseAttributes } from './utils/camel-case-attrs.js';
import { renderSVG } from './utils/render.js';
import { scrapeMotionValuesFromProps } from './utils/scrape-motion-values.js';
import type { TransformProperties } from '$lib/motion-start/motion/types.js';
import type { DOMVisualElementOptions } from '../dom/types.js';
import type { ResolvedValues } from '../types.js';
import type { TargetProjection, LayoutState } from '../utils/state.js';
import type { SVGRenderState } from './types.js';

var svgVisualElement = visualElement<SVGElement>(__assign(__assign({}, htmlConfig), {
    getBaseTarget: function (props: { [x: string]: any; }, key: string | number) {
        return props[key];
    },
    readValueFromInstance: function (domElement: { getAttribute: (arg0: any) => any; }, key: string) {
        var _a;
        if (isTransformProp(key)) {
            return ((_a = getDefaultValueType(key)) === null || _a === void 0 ? void 0 : _a.default) || 0;
        }
        key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
        return domElement.getAttribute(key);
    },
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
    build: function (_element: any, renderState: SVGRenderState, latestValues: ResolvedValues, projection: TargetProjection | undefined, layoutState: LayoutState | undefined, options: DOMVisualElementOptions, props: { transformTemplate: ((transform: TransformProperties, generatedTransform: string) => string) | undefined; }) {
        var isProjectionTranform = projection?.isEnabled && layoutState?.isHydrated;
        buildSVGAttrs(renderState, latestValues, projection, layoutState, options, props.transformTemplate, isProjectionTranform ? buildLayoutProjectionTransform : undefined, isProjectionTranform
            ? buildLayoutProjectionTransformOrigin
            : undefined);
    }, render: renderSVG
}));

export { svgVisualElement };

