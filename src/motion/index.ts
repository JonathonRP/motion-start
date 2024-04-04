/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import * as React from "react";
import { MotionProps } from "./types";
import { RenderComponent, FeatureBundle } from "./features/types";
import { CreateVisualElement } from "../render/types";
import { UseVisualState } from "./utils/use-visual-state";
export interface MotionComponentConfig<Instance, RenderState> {
    preloadedFeatures?: FeatureBundle;
    createVisualElement?: CreateVisualElement<Instance>;
    useRender: RenderComponent<Instance, RenderState>;
    useVisualState: UseVisualState<Instance, RenderState>;
    Component: string | React.ComponentType;
}
/**
 * Create a `motion` component.
 *
 * This function accepts a Component argument, which can be either a string (ie "div"
 * for `MotionDiv`), or an actual React component.
 *
 * Alongside this is a config option which provides a way of rendering the provided
 * component "offline", or outside the React render cycle.
 *
 * @internal
 */
export declare function createMotionComponent<Props extends {}, Instance, RenderState>({ preloadedFeatures, createVisualElement, useRender, useVisualState, Component, }: MotionComponentConfig<Instance, RenderState>): React.ForwardRefExoticComponent<React.PropsWithoutRef<Props & MotionProps> & React.RefAttributes<Instance>>;


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import Motion from './Motion.svelte';
import { loadFeatures } from "./features/definitions"

export const createMotionComponent = (
    {
        preloadedFeatures,
        createVisualElement,
        forwardMotionProps,
        visualStateConfig,
        Component,

    }
) => {
    preloadedFeatures && loadFeatures(preloadedFeatures)
    return class MotionComponent extends Motion {
        constructor(options) {
            const props = options.props;
            options.props = {
                props: props,
                defaultFeatures: preloadedFeatures,
                createVisualElement: createVisualElement,
                forwardMotionProps: forwardMotionProps,
                Component: Component,
                visualStateConfig
            }
            super(options)
        }
    }
}