<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import { frame } from "../frameloop";
    import { onMount } from "svelte";

    let isMounted = false;
    const forcedRenderCount = 0;
    onMount(() => (isMounted = true));

    const _forceRender = (_forcedRenderCount: number) => () => {
        isMounted && _forcedRenderCount++;
    };

    /**
     * Defer this to the end of the next animation frame in case there are multiple
     * synchronous calls.
     */
    const _deferredForceRender = (__forceRender: () => void) =>
        () => frame.postRender(__forceRender)

    $: forceRender = _forceRender(forcedRenderCount)
    $: deferredForceRender = _deferredForceRender(forceRender)
</script>

<slot {...[deferredForceRender, forcedRenderCount] as [VoidFunction, number]} />