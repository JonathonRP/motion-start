<script lang="ts">
    import { motion, AnimatePresence } from "$lib/motion-start";

    let index = $state(0);
</script>

<div class="p-8">
    <h1 class="text-2xl mb-4">Debug Exit Animation</h1>

    <button
        class="px-4 py-2 bg-blue-500 text-white rounded mb-4"
        onclick={() => index++}
    >
        Increment (index: {index})
    </button>

    <div class="relative h-32 bg-gray-200 rounded">
        <AnimatePresence initial={false} values={[{ key: index }]}>
            {#snippet children({ item })}
                <motion.div
                    class="absolute inset-0 flex items-center justify-center bg-blue-500 text-white rounded"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                >
                    Item {item.key}
                </motion.div>
            {/snippet}
        </AnimatePresence>
    </div>

    <p class="mt-4 text-sm text-gray-600">
        Click the button. The old item should animate out (fade + slide left)
        while the new item animates in (fade + slide from right).
    </p>
</div>
