<!-- <svelte:options runes={true}/> -->
<script lang="ts">
    import type { SvelteHTMLElements } from "svelte/elements";
    import type { Snippet } from "svelte";
    import type { MotionProps } from "../../motion";
    import Motion from "../../motion/Motion.svelte";

    // let {as, class: className, children, ...restProps}: {as: keyof SvelteHTMLElements, children: Snippet, class: string } & MotionProps = $props();
    export let ___tag: keyof SvelteHTMLElements;
</script>

<Motion {...$$restProps} let:props let:motion>
    <svelte:element this={___tag} class={props.class} use:motion {...props}>
        <slot />
    </svelte:element>
</Motion>
