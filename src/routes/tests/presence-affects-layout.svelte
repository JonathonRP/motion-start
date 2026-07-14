<script lang="ts">
import { AnimatePresence, motion } from '$lib/motion-start';

let count1 = $state(0);
let count2 = $state(0);
let showReflowItem = $state(true);

const items1 = $derived(Array.from({ length: count1 }, (_, i) => ({ key: i })));
const items2 = $derived(Array.from({ length: count2 }, (_, i) => ({ key: i })));
const reflowItems = $derived(showReflowItem ? [{ key: 'reflow-item' }] : []);
</script>

<div style="display: flex; flex-direction: column; gap: 8px; padding: 20px;">
    <div>
        <button id="add-with-layout" onclick={() => (count1 += 1)}
            >Add (with)</button
        >
        <button
            id="remove-with-layout"
            onclick={() => (count1 = Math.max(0, count1 - 1))}
            >Remove (with)</button
        >
    </div>

    <div
        id="list-with-layout"
        style="display: flex; flex-direction: column; gap: 4px;"
    >
        <AnimatePresence>
            {#each items1 as item (item.key)}
                <motion.div
                    id="item-with-layout-{item.key}"
                    class="item-with-layout"
                    style={{
                        width: "100px",
                        height: "40px",
                        background: "blue",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                >
                    {item.key}
                </motion.div>
            {/each}
        </AnimatePresence>
    </div>

    <div style="margin-top: 20px;">
        <button id="add-without-layout" onclick={() => (count2 += 1)}
            >Add (without)</button
        >
        <button
            id="remove-without-layout"
            onclick={() => (count2 = Math.max(0, count2 - 1))}
            >Remove (without)</button
        >
    </div>

    <div
        id="list-without-layout"
        style="display: flex; flex-direction: column; gap: 4px;"
    >
        <AnimatePresence presenceAffectsLayout={false}>
            {#each items2 as item (item.key)}
                <motion.div
                    id="item-without-layout-{item.key}"
                    class="item-without-layout"
                    style={{
                        width: "100px",
                        height: "40px",
                        background: "red",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                >
                    {item.key}
                </motion.div>
            {/each}
        </AnimatePresence>
    </div>

    <div style="margin-top: 20px;">
        <button id="remove-reflow-item" onclick={() => (showReflowItem = false)}
            >Remove reflow item</button
        >
    </div>

    <div
        id="reflow-list"
        style="display: flex; flex-direction: column; gap: 4px; position: relative;"
    >
        <AnimatePresence>
            {#each reflowItems as item (item.key)}
                <motion.div
                    id={item.key}
                    style={{
                        width: "100px",
                        height: "40px",
                        background: "purple",
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                />
            {/each}
        </AnimatePresence>

        <motion.div
            id="reflow-sibling"
            style={{
                width: "100px",
                height: "40px",
                background: "green",
            }}
            transition={{ duration: 0.3 }}
            layout
        />
    </div>
</div>
