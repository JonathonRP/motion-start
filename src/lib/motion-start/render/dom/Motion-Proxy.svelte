<!-- <svelte:options runes={true}/> -->
<script lang="ts">
    import type { SvelteHTMLElements } from "svelte/elements";
    import type { MotionProps } from "../../motion";
    import Motion from "../../motion/Motion.svelte";

    // let {as, class: className, children, ...restProps}: {as: keyof SvelteHTMLElements, children: Snippet, class: string } & MotionProps = $props();
    export let ___tag: keyof SvelteHTMLElements;
    export let el: SvelteHTMLElements[typeof ___tag]["this"];
    export let isSVG: boolean;
</script>

<Motion {...$$restProps} let:props let:motion isSVG>
    <svelte:element
        this={___tag}
        {...props}
        bind:this={el}
        class={props.class}
        xmnls={isSVG ? "http://www.w3.org/2000/svg" : undefined}
        use:motion
    >
        <slot />
    </svelte:element>
</Motion>
