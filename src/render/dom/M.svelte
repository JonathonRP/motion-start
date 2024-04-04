<svelte:options runes={true}/>
<script lang="ts">
    import { SvelteHTMLElements } from "svelte/elements";
    import Motion from "../../motion/Motion.svelte";
    import { Snippet, SvelteComponent } from "svelte";

    let {___tag, class: className, children, ...restProps}: {___tag: keyof SvelteHTMLElements, children: Snippet, class: string } = $props();
</script>

<Motion {...restProps} let:props let:motion>
    <svelte:element this={___tag} class={className} use:motion {...props}>
        {@render children()}
    </svelte:element>
</Motion>

