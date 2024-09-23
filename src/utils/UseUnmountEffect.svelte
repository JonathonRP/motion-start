<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import { onDestroy } from "svelte";
    export let callback = () => {};

    onDestroy(() => callback());
</script>

<slot />
