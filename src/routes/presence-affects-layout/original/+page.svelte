<script lang="ts">
    import { motion, AnimatePresence } from "$lib/motion-start";
    import Box from "$lib/components/Box.svelte";

    let showWithLayout = true;
    let showWithoutLayout = true;
    let count1 = 0;
    let count2 = 0;

    const items1 = () => Array.from({ length: count1 }, (_, i) => i);
    const items2 = () => Array.from({ length: count2 }, (_, i) => i);
</script>

<Box>
    <div class="space-y-8 p-6">
        <h1 class="text-2xl font-bold">presenceAffectsLayout Test</h1>

        <!-- Test 1: presenceAffectsLayout={true} (default) -->
        <div class="border-2 border-blue-500 p-4 rounded">
            <h2 class="text-lg font-semibold mb-2">
                With Layout Animation (presenceAffectsLayout=true, default)
            </h2>
            <p class="text-sm text-gray-600 mb-4">
                List items should animate in/out and trigger layout
                recalculation
            </p>

            <div class="flex gap-2 mb-4">
                <button
                    id="add-with-layout"
                    on:click={() => (count1 += 1)}
                    class="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Add Item
                </button>
                <button
                    id="remove-with-layout"
                    on:click={() => (count1 = Math.max(0, count1 - 1))}
                    class="px-3 py-1 bg-red-500 text-white rounded"
                >
                    Remove Item
                </button>
            </div>

            <div id="list-with-layout" class="flex flex-col gap-2 min-h-12">
                <AnimatePresence>
                    {#each items1() as item (item)}
                        <motion.div
                            id="item-with-layout-{item}"
                            class="item-with-layout border px-3 py-2 bg-blue-100 rounded"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            layout
                        >
                            Item {item}
                        </motion.div>
                    {/each}
                </AnimatePresence>
            </div>
        </div>

        <!-- Test 2: presenceAffectsLayout={false} -->
        <div class="border-2 border-red-500 p-4 rounded">
            <h2 class="text-lg font-semibold mb-2">
                Without Layout Animation (presenceAffectsLayout=false)
            </h2>
            <p class="text-sm text-gray-600 mb-4">
                List items should animate but NOT trigger layout recalculation
            </p>

            <div class="flex gap-2 mb-4">
                <button
                    id="add-without-layout"
                    on:click={() => (count2 += 1)}
                    class="px-3 py-1 bg-red-500 text-white rounded"
                >
                    Add Item
                </button>
                <button
                    id="remove-without-layout"
                    on:click={() => (count2 = Math.max(0, count2 - 1))}
                    class="px-3 py-1 bg-orange-500 text-white rounded"
                >
                    Remove Item
                </button>
            </div>

            <div id="list-without-layout" class="flex flex-col gap-2 min-h-12">
                <AnimatePresence presenceAffectsLayout={false}>
                    {#each items2() as item (item)}
                        <motion.div
                            id="item-without-layout-{item}"
                            class="item-without-layout border px-3 py-2 bg-red-100 rounded"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            layout
                        >
                            Item {item}
                        </motion.div>
                    {/each}
                </AnimatePresence>
            </div>
        </div>

        <p class="text-xs text-gray-500 mt-6">
            Observe: With layout=true on children and presenceAffectsLayout=true
            (left), sibling items reflow when one exits. With
            presenceAffectsLayout=false (right), items animate but don't trigger
            layout recalculation.
        </p>
    </div>
</Box>
