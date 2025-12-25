<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    let { callback = () => {} }: { callback?: () => void } = $props();

    $effect(() => {
        return () => callback();
    });
</script>

<slot />
