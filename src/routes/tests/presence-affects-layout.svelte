<script lang="ts">
    import { AnimatePresence, motion } from "$lib/motion-start";

    let count1 = $state(0);
    let count2 = $state(0);

    const items1 = $derived(
        Array.from({ length: count1 }, (_, i) => ({ key: i })),
    );
    const items2 = $derived(
        Array.from({ length: count2 }, (_, i) => ({ key: i })),
    );
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
        <AnimatePresence values={items1}>
            {#snippet children({ item })}
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
            {/snippet}
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
        <AnimatePresence presenceAffectsLayout={false} values={items2}>
            {#snippet children({ item })}
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
            {/snippet}
        </AnimatePresence>
    </div>
</div>
