<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
    export type MotionComponentProps<Props> = {
        [K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
    } & MotionProps;

    function useLayoutId({ layoutId }: MotionProps, isCustom = false) {
        const layoutGroupId = fromStore(
            useContext(LayoutGroupContext, isCustom),
        ).current.id;
        return layoutGroupId && layoutId !== undefined
            ? layoutGroupId + "-" + layoutId
            : layoutId;
    }

    function useStrictMode(
        configAndProps: MotionProps,
        preloadedFeatures?: FeatureBundle,
        isCustom = false,
    ) {
        const isStrict = fromStore(useContext(LazyContext, isCustom)).current
            .strict;

        /**
         * If we're in development mode, check to make sure we're not rendering a motion component
         * as a child of LazyMotion, as this will break the file-size benefits of using it.
         */
        if (
            process.env.NODE_ENV !== "production" &&
            preloadedFeatures &&
            isStrict
        ) {
            const strictMessage =
                "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
            configAndProps.ignoreStrict
                ? warning(false, strictMessage)
                : invariant(false, strictMessage);
        }
    }

    function getProjectionFunctionality(props: MotionProps) {
        const { drag, layout } = featureDefinitions;

        if (!drag && !layout) return {};

        const combined = { ...drag, ...layout };

        return {
            MeasureLayout:
                drag?.isEnabled(props) || layout?.isEnabled(props)
                    ? combined.MeasureLayout
                    : undefined,
            ProjectionNode: combined.ProjectionNode,
        };
    }
</script>

<script lang="ts" generics="Props extends {}, Instance, RenderState">
    import type { Component } from "svelte";
    import { fromStore } from "svelte/store";
    import type { MotionProps } from "./types";
    import type { RenderComponent, FeatureBundle } from "./features/types";
    import { MotionConfigContext } from "../context/MotionConfigContext";
    import { MotionContext } from "../context/MotionContext";
    import { useVisualElement } from "./utils/use-visual-element.svelte";
    import type { UseVisualState } from "./utils/use-visual-state";
    import { useMotionRef } from "./utils/use-motion-ref";
    import { useCreateMotionContext } from "../context/MotionContext/create.svelte";
    import { isBrowser } from "../utils/is-browser";
    import { LayoutGroupContext } from "../context/LayoutGroupContext";
    import { LazyContext } from "../context/LazyContext";
    import type { CreateVisualElement } from "../render/types";
    import { invariant, warning } from "../utils/errors";
    import { featureDefinitions } from "./features/definitions";
    import type { Ref } from "../utils/safe-react-types";
    import { useContext } from "../context/utils/context.svelte";

    type MotionCompProps = MotionComponentProps<Props> & {
        externalRef?: Ref<Instance> | undefined;
        ref?: Instance | null;
        children?: import("svelte").Snippet;
    };

    let { children, externalRef, ref, ...props }: MotionCompProps = $props();

    /**
     * If we need to measure the element we load this functionality in a
     * separate class component in order to gain access to getSnapshotBeforeUpdate.
     */
    let MeasureLayout: undefined | Component<MotionProps> = $state(undefined);

    const configAndProps = $derived({
        ...fromStore(useContext(MotionConfigContext)).current,
        ...props,
        layoutId: useLayoutId(props),
    });

    $inspect(configAndProps);

    const { isStatic } = $derived(configAndProps);

    const context = $derived(useCreateMotionContext<Instance>(props));

    const visualState = $derived(useVisualState(props, isStatic));

    if (!isStatic && isBrowser) {
        // useStrictMode(configAndProps, preloadedFeatures);

        const layoutProjection = $derived(
            getProjectionFunctionality(configAndProps),
        );
        /**
         * If we need to measure the element we load this functionality in a
         * separate class component in order to gain access to getSnapshotBeforeUpdate.
         */
        MeasureLayout = layoutProjection.MeasureLayout;

        /**
         * Create a VisualElement for this component. A VisualElement provides a common
         * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
         * providing a way of rendering to these APIs outside of the React render loop
         * for more performant animations and interactions
         */
        context.visualElement = useVisualElement<Instance, RenderState>(
            Component,
            visualState,
            configAndProps,
            createVisualElement,
            layoutProjection.ProjectionNode,
        );

        // MotionContext.Provider
        MotionContext["_c"] = this;
        MotionContext.Provider = context;
    }

    $effect(() => {
        return () => {
            // Since useMotionRef is not called on destroy, the visual element is unmounted here
            context.visualElement?.unmount();
        };
    });
</script>

{#if MeasureLayout && context.visualElement}
    <MeasureLayout
        {...{
            visualElement: context.visualElement,
            ...configAndProps,
        }}
    />
{/if}
<UseRender
    {...{
        Component,
        props,
        ref: useMotionRef<Instance, RenderState>(
            visualState,
            context.visualElement,
            externalRef,
        ),
        visualState,
        isStatic,
        visualElement: context.visualElement,
        children,
        el: ref,
    }}
/>
