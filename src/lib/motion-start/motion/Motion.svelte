<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
    export type MotionComponentProps<Props> = {
        [K in Exclude<keyof Props, keyof MotionProps>]?: Props[K];
    } & MotionProps;

    function useLayoutId({ layoutId }: MotionProps) {
        const layoutGroupId = fromStore(useContext(LayoutGroupContext)).current
            .id;
        return layoutGroupId && layoutId !== undefined
            ? layoutGroupId + "-" + layoutId
            : layoutId;
    }

    function useStrictMode(
        configAndProps: MotionProps,
        preloadedFeatures?: FeatureBundle,
    ) {
        const isStrict = fromStore(useContext(LazyContext)).current.strict;

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

<script lang="ts" generics="Props extends MotionProps, Instance, RenderState">
    import { getContext, untrack, type Component } from "svelte";
    import { fromStore } from "svelte/store";
    import type { MotionProps } from "./types";
    import type { FeatureBundle } from "./features/types";
    import { MotionConfigContext } from "../context/MotionConfigContext";
    import { MotionContext } from "../context/MotionContext";
    import { useVisualElement } from "./utils/use-visual-element.svelte";
    import { useMotionRef } from "./utils/use-motion-ref";
    import { useCreateMotionContext } from "../context/MotionContext/create.svelte";
    import { isBrowser } from "../utils/is-browser";
    import { LayoutGroupContext } from "../context/LayoutGroupContext";
    import { LazyContext } from "../context/LazyContext";
    import { invariant, warning } from "../utils/errors";
    import { featureDefinitions } from "./features/definitions.svelte";
    import type { Ref } from "../utils/safe-react-types";
    import { useContext } from "../context/utils/context.svelte";
    import type { MotionComponentConfig } from "./index.svelte";
    import type { VisualElement } from "../render/VisualElement.svelte";

    type MotionCompProps = MotionComponentProps<Props> & {
        externalRef?: Ref<Instance> | undefined;
        ref?: Instance | null;
        children?: import("svelte").Snippet;
    };

    let {
        children,
        externalRef,
        ref = $bindable(),
        ...props
    }: MotionCompProps = $props();

    const motionProps = $derived(props);

    const {
        Component: as,
        createVisualElement,
        useVisualState,
        useRender: Renderer,
        preloadedFeatures,
    } = getContext<
        Pick<
            MotionComponentConfig<Instance, RenderState>,
            "Component" | "createVisualElement" | "useVisualState" | "useRender"
        >
    >("motionContexts");

    /**
     * If we need to measure the element we load this functionality in a
     * separate class component in order to gain access to getSnapshotBeforeUpdate.
     */
    let MeasureLayout = $state<
        | Component<
              MotionProps & { visualElement: VisualElement<unknown, unknown> }
          >
        | undefined
    >(undefined);

    const layoutId = $derived(useLayoutId(motionProps));

    const configAndProps = $derived({
        ...fromStore(useContext(MotionConfigContext)).current,
        ...motionProps,
        layoutId,
    });

    const { isStatic } = $derived(configAndProps);

    const context = $derived(useCreateMotionContext<Instance>(motionProps));
    const visualState = $derived(useVisualState(motionProps, isStatic));

    if (!isStatic && isBrowser) {
        useStrictMode(configAndProps, preloadedFeatures);

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
            as,
            visualState,
            () => configAndProps,
            createVisualElement,
            layoutProjection.ProjectionNode,
        );
    }

    $effect(() => {
        // MotionContext.Provider
        MotionContext.Provider = context;

        return () => {
            console.log("dismount");
            // Since useMotionRef is not called on destroy, the visual element is unmounted here
            context.visualElement?.unmount();
        };
    });
</script>

{#if MeasureLayout && context.visualElement}
    <MeasureLayout visualElement={context.visualElement} {...configAndProps} />
{/if}
<Renderer
    Component={as}
    props={motionProps}
    bind:ref={() => ref as Instance,
    (v: Instance) => {
        useMotionRef<Instance, RenderState>(
            visualState,
            context.visualElement,
            externalRef,
        )(v);
        ref = v;
    }}
    {visualState}
    {isStatic}
    visualElement={context.visualElement}
>
    {@render children?.()}
</Renderer>
