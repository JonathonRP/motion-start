<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { getContext } from "svelte";
    import type { RenderComponent } from "../../motion/features/types";
    import type { HTMLRenderState } from "../html/types";
    import type { SVGRenderState } from "../svg/types";
    import { filterProps } from "./utils/filter-props";
    import { isSVGComponent } from "./utils/is-svg-component";
    import { useSvgProps } from "../svg/use-props";
    import { useHTMLProps } from "../html/use-props";
    import type { SvelteHTMLElements } from "svelte/elements";

    type Props = Parameters<
        RenderComponent<
            HTMLElement | SVGElement,
            HTMLRenderState | SVGRenderState
        >
    >[1] & { el: SvelteHTMLElements[typeof Component]["this"] };

    let {
        Component,
        props,
        ref,
        visualState,
        isStatic,
        children,
        el = $bindable(),
    }: Props = $props();

    const { latestValues } = $derived(visualState);
    const useVisualProps = $derived(
        isSVGComponent(Component) ? useSvgProps : useHTMLProps,
    );

    const visualProps = $derived(
        useVisualProps(props as any, latestValues, isStatic, Component),
    );

    const filteredProps = $derived(
        filterProps(
            props,
            typeof Component === "string",
            getContext("forwardMotionProps"),
        ),
    );

    const elementProps = $derived({ ...filteredProps, ...visualProps });

    const motion = (node) => {
        ref(node);
    };

    // $inspect(el);
    // $: typeof ref === "function" ? ref(element) : (ref!.current = element);
</script>

<svelte:element
    this={Component}
    bind:this={el}
    use:ref
    {...elementProps}
    {...isSVGComponent(Component)
        ? { xmlns: "http://www.w3.org/2000/svg" }
        : {}}
>
    {@render children?.()}
</svelte:element>
