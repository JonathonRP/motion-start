/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { CreateVisualElement } from "../render/types";
import type { FeatureBundle, RenderComponent } from "./features/types";
import type { UseVisualState } from "./utils/use-visual-state";
export type { MotionProps } from "./types";

export interface MotionComponentConfig<Instance, RenderState> {
    preloadedFeatures?: FeatureBundle;
    createVisualElement?: CreateVisualElement<Instance>;
    useRender: RenderComponent<Instance, RenderState>;
    useVisualState: UseVisualState<Instance, RenderState>;
    Component: string | React.ComponentType;
}


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import Motion from './Motion.svelte';
import { loadFeatures } from "./features/definitions";
import type { MotionProps } from "./types";

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
export const createMotionComponent = <Props extends {}, Instance, RenderState>(
    {
        preloadedFeatures,
        createVisualElement,
        forwardMotionProps,
        visualStateConfig,
        Component,

    }: MotionComponentConfig<Instance, RenderState>
): React.ForwardRefExoticComponent<React.PropsWithoutRef<Props & MotionProps> & React.RefAttributes<Instance>> => {
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
