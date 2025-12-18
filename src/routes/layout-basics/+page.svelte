<script lang="ts">
    import { motion, AnimatePresence } from "$lib/motion-start";

    let showPresence = $state(false);
    let items = $state<number[]>([1, 2, 3]);
    let wide = $state(false);
    const add = () => (items = [...items, items.length + 1]);
    const remove = () =>
        (items = items.slice(0, Math.max(0, items.length - 1)));
    const resize = () => (wide = !wide);

    // presenceAffectsLayout test lists
    let layoutItems = $state([{ key: 1 }, { key: 2 }, { key: 3 }]);
    let noLayoutItems = $state([{ key: 1 }, { key: 2 }, { key: 3 }]);
    let defaultItems = $state([{ key: 1 }, { key: 2 }, { key: 3 }]);

    let nextLayoutKey = $state(4);
    let nextNoLayoutKey = $state(4);
    let nextDefaultKey = $state(4);

    const addLayoutItem = () => {
        layoutItems = [{ key: nextLayoutKey++ }, ...layoutItems];
    };
    const removeLayoutItem = () => {
        layoutItems = layoutItems.slice(1);
    };

    const addNoLayoutItem = () => {
        noLayoutItems = [{ key: nextNoLayoutKey++ }, ...noLayoutItems];
    };
    const removeNoLayoutItem = () => {
        noLayoutItems = noLayoutItems.slice(1);
    };

    const addDefaultItem = () => {
        defaultItems = [...defaultItems, { key: nextDefaultKey++ }];
    };
</script>

<div class="space-y-6 p-6">
    <h1 id="title" class="text-xl font-bold">Layout Basics</h1>
    <div class="space-x-3">
        <button id="resize" onclick={resize} class="px-3 py-1 border">
            Resize Box
        </button>
        <button id="add" onclick={add} class="px-3 py-1 border">
            Add Item
        </button>
        <button id="remove" onclick={remove} class="px-3 py-1 border">
            Remove Item
        </button>
        <button
            id="presence-toggle"
            onclick={() => (showPresence = !showPresence)}
            class="px-3 py-1 border"
        >
            Toggle Presence
        </button>
    </div>

    <div class="h-24">
        <motion.div
            id="layout-box"
            layout
            initial={{ width: "160px" }}
            animate={{
                width: wide ? "320px" : "160px",
                backgroundColor: wide ? "#88f" : "#8f8",
            }}
            style={{ height: "96px" }}
            class="border"
        />
    </div>

    <div id="list" class="flex gap-2">
        {#each items as i (i)}
            <div class="item border px-3 py-2">Item {i}</div>
        {/each}
    </div>

    <div class="h-24">
        <AnimatePresence show={showPresence}>
            <motion.div
                id="presence-box"
                class="border px-3 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
            >
                Presence
            </motion.div>
        </AnimatePresence>
    </div>

    <!-- presenceAffectsLayout=true (default) -->
    <div class="space-y-2">
        <h2 class="text-lg font-semibold">
            With Layout (presenceAffectsLayout=true)
        </h2>
        <div class="space-x-2">
            <button
                id="add-layout-item"
                onclick={addLayoutItem}
                class="px-3 py-1 border"
            >
                Add Layout Item
            </button>
            <button
                id="remove-layout-item"
                onclick={removeLayoutItem}
                class="px-3 py-1 border"
            >
                Remove Layout Item
            </button>
        </div>
        <div id="layout-list" class="flex flex-col gap-2">
            <AnimatePresence values={layoutItems} let:item>
                <motion.div
                    class="layout-item border px-3 py-2 bg-blue-100"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                >
                    Layout Item {item.key}
                </motion.div>
            </AnimatePresence>
        </div>
    </div>

    <!-- presenceAffectsLayout=false -->
    <div class="space-y-2">
        <h2 class="text-lg font-semibold">
            Without Layout (presenceAffectsLayout=false)
        </h2>
        <div class="space-x-2">
            <button
                id="add-no-layout-item"
                onclick={addNoLayoutItem}
                class="px-3 py-1 border"
            >
                Add No-Layout Item
            </button>
            <button
                id="remove-no-layout-item"
                onclick={removeNoLayoutItem}
                class="px-3 py-1 border"
            >
                Remove No-Layout Item
            </button>
        </div>
        <div id="no-layout-list" class="flex flex-col gap-2">
            <AnimatePresence
                presenceAffectsLayout={false}
                values={noLayoutItems}
                let:item
            >
                <motion.div
                    class="no-layout-item border px-3 py-2 bg-red-100"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                >
                    No-Layout Item {item.key}
                </motion.div>
            </AnimatePresence>
        </div>
    </div>

    <!-- Default behavior test -->
    <div class="space-y-2">
        <h2 class="text-lg font-semibold">Default Behavior</h2>
        <button
            id="add-default-item"
            onclick={addDefaultItem}
            class="px-3 py-1 border"
        >
            Add Default Item
        </button>
        <div id="default-presence-list" class="flex flex-col gap-2">
            <AnimatePresence values={defaultItems} let:item>
                <motion.div
                    class="default-item border px-3 py-2 bg-green-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                >
                    Default Item {item.key}
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
</div>
