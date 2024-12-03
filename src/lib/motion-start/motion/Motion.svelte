<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();
</script>

{@render children?.()}
