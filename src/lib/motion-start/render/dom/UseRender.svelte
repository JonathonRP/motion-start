<script lang="ts">
    import { afterUpdate, getContext } from "svelte";
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

    export let Component: $$Props["Component"],
        props: $$Props["props"],
        ref: $$Props["ref"],
        visualState: $$Props["visualState"],
        isStatic: $$Props["isStatic"];

    let elementProps = {};

    afterUpdate(() => {
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
        console.log(node);
        ref(node);
    };

    // $: typeof ref === "function" ? ref(element) : (ref!.current = element);
</script>

<svelte:element this={Component} use:ref {...elementProps}>
    <slot />
</svelte:element>
