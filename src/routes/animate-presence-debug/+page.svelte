<script lang="ts">
    import { motion, AnimatePresence } from "$lib/motion-start";
    import { onMount } from "svelte";

    let show = $state(false);
    let clickCount = $state(0);

    onMount(() => {
        console.log('[DEBUG] Page mounted');
        (window as any).__debugReady = true;
    });

    $effect(() => {
        console.log('[DEBUG] Parent $effect - show:', show, 'clickCount:', clickCount);
    });

    function toggleShow() {
        clickCount++;
        show = !show;
        console.log('[DEBUG] Button clicked - show is now:', show, 'clickCount:', clickCount);
    }
</script>

<div class="p-8">
    <h1 class="text-2xl font-bold mb-4">AnimatePresence Reactivity Debug</h1>
    
    <div class="mb-4">
        <p>Click count: {clickCount}</p>
        <p>Show state: {show ? 'true' : 'false'}</p>
    </div>

    <button
        id="debug-toggle"
        type="button"
        onclick={toggleShow}
        class="px-4 py-2 bg-blue-500 text-white rounded mb-4"
    >
        Toggle (clicks: {clickCount})
    </button>

    <div class="border-2 border-gray-300 p-4 min-h-[100px]">
        <p class="text-sm text-gray-600 mb-2">AnimatePresence container:</p>
        <AnimatePresence show={show}>
            <motion.div
                id="debug-item"
                class="bg-green-500 text-white p-4 rounded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
            >
                I am visible! Show = {String(show)}
            </motion.div>
        </AnimatePresence>
    </div>

    <div class="mt-4">
        <p class="text-sm text-gray-600">Check console for logs</p>
    </div>
</div>

<style>
    :global(body) {
        font-family: system-ui, -apple-system, sans-serif;
    }
</style>
