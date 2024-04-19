<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import type { MotionProps } from "./index.js";
    import { MotionConfigContext } from "../context/MotionConfigContext";
    import { UseVisualElement } from "./utils/use-visual-element";
    import { UseFeatures } from "./features/use-features";
    import MotionContextProvider from "../context/MotionContext/MotionContextProvider.svelte";
    import { getContext, onMount } from "svelte";
    import { UseRender } from "../render/dom/use-render.js";
    import { createDomVisualElement } from "../render/dom/create-visual-element.js";
    import { svgMotionConfig } from "../render/svg/config-motion.js";
    import { htmlMotionConfig } from "../render/html/config-motion.js";
    import { UseCreateMotionContext } from "../context/MotionContext/create";
    import { UseVisualState } from "./utils/use-visual-state.js";
    import { useMotionRef } from "./utils/use-motion-ref.js";
    import ScaleCorrectionProvider from "../context/ScaleCorrectionProvider.svelte";
    import { featureBundle } from "../render/dom/featureBundle.js";
    import { loadFeatures } from "./features/definitions";

    type $$Props = MotionProps;

    // component props
    export let initial: $$Props['initial'] = undefined,
        style: $$Props['style'] = undefined,
        transformTemplate: $$Props['transformTemplate'] = undefined,
        transformValues = undefined,
        //AnimationProps
        animate: $$Props['animate'] = undefined,
        exit: $$Props['exit'] = undefined,
        variants: $$Props['variants'] = undefined,
        transition: $$Props['transition'] = undefined,
        //VisualElementLifecycles
        onViewportBoxUpdate: $$Props['onViewportBoxUpdate'] = undefined,
        onBeforeLayoutMeasure: $$Props['onBeforeLayoutMeasure'] = undefined,
        onLayoutMeasure: $$Props['onLayoutMeasure'] = undefined,
        onUpdate: $$Props['onUpdate'] = undefined,
        onAnimationStart: $$Props['onAnimationStart'] = undefined,
        onAnimationComplete: $$Props['onAnimationComplete'] = undefined,
        onLayoutAnimationComplete: $$Props['onLayoutAnimationComplete'] = undefined,
        //GestureHandlers
        // PanHandlers
        onPan: $$Props['onPan'] = undefined,
        onPanStart: $$Props['onPanStart'] = undefined,
        onPanSessionStart: $$Props['onPanSessionStart'] = undefined,
        onPanEnd: $$Props['onPanEnd'] = undefined,
        // TapHandlers
        onTap: $$Props['onTap'] = undefined,
        onTapStart: $$Props['onTapStart'] = undefined,
        onTapCancel: $$Props['onTapCancel'] = undefined,
        whileTap: $$Props['whileTap'] = undefined,
        //HoverHandlers
        whileHover: $$Props['whileHover'] = undefined,
        onHoverStart: $$Props['onHoverStart'] = undefined,
        onHoverEnd: $$Props['onHoverEnd'] = undefined,
        //FocusHandlers
        whileFocus: $$Props['whileFocus'] = undefined,
        //DraggableProps
        drag: $$Props['drag'] = undefined,
        whileDrag: $$Props['whileDrag']  = undefined,
        dragDirectionLock: $$Props['dragDirectionLock'] = undefined,
        dragPropagation: $$Props['dragPropagation'] = undefined,
        dragConstraints: $$Props['dragConstraints'] = undefined,
        dragElastic: $$Props['dragElastic'] = undefined,
        dragMomentum: $$Props['dragMomentum'] = undefined,
        dragTransition: $$Props['dragTransition'] = undefined,
        dragControls: $$Props['dragControls'] = undefined,
        dragListener: $$Props['dragListener'] = undefined,
        onMeasureDragConstraints: $$Props['onMeasureDragConstraints'] = undefined,
        _dragX: $$Props['_dragX'] = undefined,
        _dragY: $$Props['_dragY'] = undefined,
        //DragHandlers
        onDragStart: $$Props['onDragStart'] = undefined,
        onDragEnd: $$Props['onDragEnd'] = undefined,
        onDrag: $$Props['onDrag'] = undefined,
        onDirectionLock: $$Props['onDirectionLock'] = undefined,
        onDragTransitionEnd: $$Props['onDragTransitionEnd'] = undefined,
        // LayoutProps
        layout: $$Props['layout'] = undefined,
        layoutId: $$Props['layoutId'] = undefined,
        //MotionAdvancedProps
        custom: $$Props['custom'] = undefined,
        inherit: $$Props['inherit'] = undefined,

        // **internal***
        isSVG = false,
        update = undefined,
        forwardMotionProps = false,
        externalRef = undefined,
        targetEl = undefined;
    
    $: motionProps = $$restProps; /*{
        initial,
        style,
        transformTemplate,
        transformValues,
        //AnimationProps
        animate,
        exit,
        variants,
        transition,
        //VisualElementLifecycles
        onViewportBoxUpdate,
        onBeforeLayoutMeasure,
        onLayoutMeasure,
        onUpdate,
        onAnimationStart,
        onAnimationComplete,
        onLayoutAnimationComplete,
        //GestureHandlers
        // PanHandlers
        onPan,
        onPanStart,
        onPanSessionStart,
        onPanEnd,
        // TapHandlers
        onTap,
        onTapStart,
        onTapCancel,
        whileTap,
        //HoverHandlers
        whileHover,
        onHoverStart,
        onHoverEnd,
        //FocusHandlers
        whileFocus,
        //DraggableProps
        drag,
        whileDrag,
        dragDirectionLock,
        dragPropagation,
        dragConstraints,
        dragElastic,
        dragMomentum,
        dragTransition,
        dragControls,
        dragListener,
        onMeasureDragConstraints,
        _dragX,
        _dragY,
        //DragHandlers
        onDragStart,
        onDragEnd,
        onDrag,
        onDirectionLock,
        onDragTransitionEnd,
        // LayoutProps
        layout,
        layoutId,
        //MotionAdvancedProps
        custom,
        inherit,
        ...(isSVG ? $$restProps : {}),
    };*/
    //$: (allProps = {...motionProps,$$restProps});

    // The SSR component needs to load this here
    loadFeatures(featureBundle);

    let Component = isSVG ? "SVG" : "DOM";
    let isCustom = targetEl || false;
    let createVisualElement = createDomVisualElement;
    let visualStateConfig = isSVG ? svgMotionConfig : htmlMotionConfig;

    /**
     * If a component is static, we only visually update it as a
     * result of a React re-render, rather than any interactions or animations.
     * If this component or any ancestor is static, we disable hardware acceleration
     * and don't load any additional functionality.
     */
    const a = getContext(MotionConfigContext) || MotionConfigContext(isCustom);

    $: ({ isStatic } = $a || {});
    let mounted = false;
    const setContext = (c, v) => {
        c.visualElement = v;
        return v;
    };

    onMount(() => {
        mounted = true;
    });
</script>

<ScaleCorrectionProvider {isCustom}>
    <UseCreateMotionContext props={motionProps} {isStatic} let:value={context}>
        <UseVisualState
            config={visualStateConfig}
            props={motionProps}
            {isStatic}
            {isCustom}
            let:state={visualState}
        >
            <UseVisualElement
                {Component}
                {visualState}
                {createVisualElement}
                props={motionProps}
                {isCustom}
                let:visualElement
            >
                <UseFeatures
                    visualElement={setContext(context, visualElement)}
                    props={motionProps}
                    let:features={_features}
                >
                    <MotionContextProvider value={context} {isCustom}>
                        <UseRender
                            {Component}
                            props={motionProps}
                            ref={useMotionRef(
                                visualState,
                                context.visualElement,
                                externalRef
                            )}
                            {visualState}
                            {isStatic}
                            {forwardMotionProps}
                            let:motion
                            let:props={renderProps}
                            {targetEl}
                        >
                            <slot {motion} props={renderProps} />
                        </UseRender>
                    </MotionContextProvider>

                    {#if mounted}
                        {#each _features as feat (feat.key)}
                            <svelte:component
                                this={feat.Component}
                                props={feat.props}
                                visualElement={feat.visualElement}
                                {isCustom}
                            />
                        {/each}
                    {/if}
                </UseFeatures>
            </UseVisualElement>
        </UseVisualState>
    </UseCreateMotionContext>
</ScaleCorrectionProvider>
