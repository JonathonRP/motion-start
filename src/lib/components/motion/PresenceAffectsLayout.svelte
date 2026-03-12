<script>
    import { motion, AnimatePresence } from "$lib/motion-start";

    let presenceAffectsLayout = true;

    let items = [
        { key: 1, label: "1", color: "#e74c3c" },
        { key: 2, label: "2", color: "#3498db" },
        { key: 3, label: "3", color: "#2ecc71" },
        { key: 4, label: "4", color: "#f39c12" },
        { key: 5, label: "5", color: "#9b59b6" },
    ];

    let nextKey = 6;

    function remove(key) {
        items = items.filter((i) => i.key !== key);
    }

    function reset() {
        items = [
            { key: nextKey++, label: "1", color: "#e74c3c" },
            { key: nextKey++, label: "2", color: "#3498db" },
            { key: nextKey++, label: "3", color: "#2ecc71" },
            { key: nextKey++, label: "4", color: "#f39c12" },
            { key: nextKey++, label: "5", color: "#9b59b6" },
        ];
    }
</script>

<div class="flex flex-col gap-4 p-2">
    <label class="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" bind:checked={presenceAffectsLayout} />
        <span class="font-medium">presenceAffectsLayout = {presenceAffectsLayout}</span>
    </label>

    <p class="text-sm text-muted-foreground">
        {#if presenceAffectsLayout}
            Remaining items will <strong>animate</strong> to their new positions when an item is removed.
        {:else}
            Remaining items will <strong>snap</strong> instantly to their new positions.
        {/if}
    </p>

    <div class="flex flex-wrap gap-3 min-h-[80px] items-start">
        <AnimatePresence {presenceAffectsLayout} list={items} let:item>
            <motion.div
                layout={true}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                class="item"
                style="background-color: {item.color};"
            >
                <span>{item.label}</span>
                <button
                    class="remove"
                    onclick={() => remove(item.key)}
                    aria-label="Remove {item.label}"
                >
                    ×
                </button>
            </motion.div>
        </AnimatePresence>
    </div>

    <button onclick={reset} class="self-start text-sm underline">Reset</button>
</div>

<style>
    .item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 0.75rem;
        height: 3rem;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        font-size: 1.1rem;
        min-width: 3.5rem;
    }

    .remove {
        all: unset;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        opacity: 0.8;
    }

    .remove:hover {
        opacity: 1;
    }
</style>
