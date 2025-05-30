<!-- https://codesandbox.io/p/sandbox/t7qxhv?file=/src/styles.css -->

<script lang="ts">
    import Box from "../Box.svelte";
    import { motion, AnimatePresence } from "$lib/motion-start";
    import { noop } from "$lib/motion-start/utils/noop";

    let count = $state(0);
    let items = $state([0]);
    let popLayout = $state(false);
    let mode = $derived<"popLayout" | "sync">(popLayout ? "popLayout" : "sync");
</script>

<Box>
    <div class="flex flex-col items-center">
        <div class="flex flex-col p-0 pb-[50px] items-center">
            <label class="flex flex-col items-center my-[20px] mx-0">
                <code>popLayout</code>
                <input
                    class="text-accent-500"
                    type="checkbox"
                    checked={popLayout}
                    onchange={(e) => {
                        popLayout = e.currentTarget.checked;
                    }}
                />
            </label>
            <motion.button
                class="bg-accent-500 text-background border-none py-[15px] px-[25px] rounded-[50px] text-[18px] font-bold cursor-pointer w-[150px]"
                whileTap={{ scale: 0.95 }}
                onclick={() => {
                    count++;
                    items = [...items, count];
                }}
            >
                Add item
            </motion.button>
        </div>
        <ul
            class="flex w-[300px] h-[300px] flex-col gap-[20px] m-0 p-0 list-none"
        >
            <AnimatePresence
                {mode}
                list={items.map((id, indx) => ({ key: id, id, indx }))}
                let:item
                let:measure
            >
                <motion.li
                    class="block bg-accent-500 h-[80px] w-full shrink-0 grow-0 basis-[80px] rounded-[20px] m-0 p-0"
                    layout
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring" }}
                    onclick={() => {
                        const newItems = [...items];
                        if (item.indx > -1) newItems.splice(item.indx, 1);
                        items = newItems;
                    }}
                    {@attach mode === "popLayout" && measure}
                />
            </AnimatePresence>
        </ul>
    </div>
</Box>
