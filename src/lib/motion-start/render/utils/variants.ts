/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../motion/types";
import type { TargetAndTransition, TargetResolver } from "../../types";
import type { ResolvedValues, VisualElement } from "../types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
/**
 * Decides if the supplied variable is an array of variant labels
 */
function isVariantLabels(v: unknown): v is string[] {
    return Array.isArray(v);
}
/**
 * Decides if the supplied variable is variant label
 */
function isVariantLabel(v: unknown): v is string | string[] {
    return typeof v === "string" || isVariantLabels(v);
}
/**
 * Creates an object containing the latest state of every MotionValue on a VisualElement
 */
function getCurrent(visualElement: VisualElement<any, any>) {
    var current = {};//@ts-ignore
    visualElement.forEachValue(function (value: { get: () => any; }, key: string | number) { return (current[key] = value.get()); });
    return current;
}
/**
 * Creates an object containing the latest velocity of every MotionValue on a VisualElement
 */
function getVelocity(visualElement: VisualElement<any, any>) {
    var velocity = {};//@ts-ignore
    visualElement.forEachValue(function (value, key) { return (velocity[key] = value.getVelocity()); });
    return velocity;
}
function resolveVariantFromProps(props: MotionProps, definition: TargetAndTransition | TargetResolver, custom?: any, currentValues?: ResolvedValues, currentVelocity?: ResolvedValues): TargetAndTransition;
function resolveVariantFromProps(props: MotionProps, definition?: string | TargetAndTransition | TargetResolver, custom?: any, currentValues?: ResolvedValues, currentVelocity?: ResolvedValues): undefined | TargetAndTransition;
function resolveVariantFromProps(props: MotionProps, definition?: string | TargetAndTransition | TargetResolver, custom?: any, currentValues?: ResolvedValues, currentVelocity?: ResolvedValues) {
    var _a;
    if (currentValues === void 0) { currentValues = {}; }
    if (currentVelocity === void 0) { currentVelocity = {}; }
    if (typeof definition === "string") {
        definition = (_a = props.variants) === null || _a === void 0 ? void 0 : _a[definition];
    }
    return typeof definition === "function"
        ? definition(custom !== null && custom !== void 0 ? custom : props.custom, currentValues, currentVelocity)
        : definition;
}
function resolveVariant(visualElement: VisualElement, definition: TargetAndTransition | TargetResolver, custom?: any): TargetAndTransition;
function resolveVariant(visualElement: VisualElement, definition?: string | TargetAndTransition | TargetResolver, custom?: any): TargetAndTransition | undefined;
function resolveVariant(visualElement: VisualElement, definition?: string | TargetAndTransition | TargetResolver, custom?: any) {
    var props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== null && custom !== void 0 ? custom : props.custom, getCurrent(visualElement), getVelocity(visualElement));
}
function checkIfControllingVariants(props: MotionProps) {
    var _a;//@ts-ignore
    return (typeof ((_a = props.animate) === null || _a === void 0 ? void 0 : _a.start) === "function" ||
        isVariantLabel(props.initial) ||
        isVariantLabel(props.animate) ||
        isVariantLabel(props.whileHover) ||
        isVariantLabel(props.whileDrag) ||
        isVariantLabel(props.whileTap) ||
        isVariantLabel(props.whileFocus) ||
        isVariantLabel(props.exit));
}
function checkIfVariantNode(props: MotionProps) {
    return Boolean(checkIfControllingVariants(props) || props.variants);
}

export { checkIfControllingVariants, checkIfVariantNode, isVariantLabel, isVariantLabels, resolveVariant, resolveVariantFromProps };
