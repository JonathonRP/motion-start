<!-- https://codesandbox.io/p/sandbox/uonye -->

<script lang="ts" module>
    const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

    function useRaisedShadow(value: MotionValue<number>) {
        const boxShadow = useMotionValue(inactiveShadow);

        $effect.pre(() => {
            let isActive = false;
            value.onChange((latest) => {
                const wasActive = isActive;
                if (latest !== 0) {
                    isActive = true;
                    if (isActive !== wasActive) {
                        animate(boxShadow, "5px 5px 10px rgba(0,0,0,0.3)");
                    }
                } else {
                    isActive = false;
                    if (isActive !== wasActive) {
                        animate(boxShadow, inactiveShadow);
                    }
                }
            });
        });

        return boxShadow;
    }
</script>

<script lang="ts">
    import {
        Reorder,
        useMotionValue,
        animate,
        MotionValue,
    } from "$lib/motion-start";
    import Box from "../Box.svelte";

    let initialItems = $state([
        "🍅 Tomato",
        "🥒 Cucumber",
        "🧀 Cheese",
        "🥬 Lettuce",
    ]);

    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
</script>

<Box>
    <Reorder.Group
        class="list-none p-0 m-0 font-medium text-2xl relative w-[300px]"
        axis="y"
        onReorder={(newItems) => {
            initialItems = newItems;
        }}
        values={initialItems}
    >
        {#snippet children(item)}
            <Reorder.Item
                class="p-0 m-0 font-medium text-2xl rounded-[5px] mb-[10px] w-full py-[15px] px-[18px] bg-white flex justify-between items-center shrink-0 cursor-grab"
                value={item}
                id={item}
                style={{ boxShadow, y }}
            >
                <span>{item}</span>
            </Reorder.Item>
        {/snippet}
    </Reorder.Group>
</Box>
