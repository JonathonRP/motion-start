<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        callback = () => {},
        children
    }: {
        callback?: () => void;
        children?: Snippet;
    } = $props();

    $effect(() => {
        return () => callback();
    });
</script>

{@render children?.()}
