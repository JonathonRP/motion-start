<!-- based on framer-motion@4.0.3,
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
