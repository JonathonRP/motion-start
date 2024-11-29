<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import { getContext } from "svelte";
    import type { RenderComponent } from "../../motion/features/types";
    import type { HTMLRenderState } from "../html/types";
    import type { SVGRenderState } from "../svg/types";
    import { filterProps } from "./utils/filter-props";
    import { isSVGComponent } from "./utils/is-svg-component";
    import { useSvgProps } from "../svg/use-props";
    import { useHTMLProps } from "../html/use-props";

    type $$Props = Parameters<
        RenderComponent<
            HTMLElement | SVGElement,
            HTMLRenderState | SVGRenderState
        >
    >[1];

    let {
        Component,
        props,
        ref,
        visualState,
        isStatic,
        children,
    }: {
        Component: $$Props["Component"];
        props: $$Props["props"];
        ref: $$Props["ref"];
        visualState: $$Props["visualState"];
        isStatic: $$Props["isStatic"];
        children: $$Props["children"];
    } = $props();

    let elementProps = {};

    $effect(() => {
        const { latestValues } = visualState;
        const useVisualProps = isSVGComponent(Component)
            ? useSvgProps
            : useHTMLProps;

        const visualProps = useVisualProps(
            props as any,
            latestValues,
            isStatic,
            Component,
        );

        const filteredProps = filterProps(
            props,
            typeof Component === "string",
            getContext("forwardMotionProps"),
        );

        elementProps = { ...filteredProps, ...visualProps };
    });

    const motion = (node) => {
        ref(node);
    };

    // $: typeof ref === "function" ? ref(element) : (ref!.current = element);
</script>

<svelte:element this={Component} use:ref {...elementProps}>
    {@render children?.()}
</svelte:element>
