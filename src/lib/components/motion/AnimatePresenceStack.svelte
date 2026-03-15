<!-- https://codesandbox.io/p/sandbox/gm9n3c?file=/src/index.js -->

<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { AnimatePresence, type PanInfo } from "$lib/motion-start";
    import Box from "../Box.svelte";

    let index = $state(0);
    let exitX = $state(0);

    let mint = $derived(index + 1);

    function handleDragEnd(_: PointerEvent, info: PanInfo) {
        if (info.offset.x < -100) {
            exitX = -250;
            index = index + 1;
        }
        if (info.offset.x > 100) {
            exitX = 250;
            index = index + 1;
        }
    }

    /**
  * This example demonstrates how to create a stack of cards that can be dragged and dismissed using Animate
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <AnimatePresence initial={false} let:item list={[{ key: index }]}>
            <Card bind:index={mint} frontCard={false} />
            <Card bind:index drag="x" frontCard={true} />
        </AnimatePresence>
    </div>
*/
</script>

<Box>
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <AnimatePresence
            initial={false}
            values={[
                { key: index, isFront: true },
                { key: mint, isFront: false },
            ]}
        >
            {#snippet children({ item })}
                <Card
                    bind:index={item.key}
                    drag={item.isFront ? "x" : false}
                    frontCard={item.isFront}
                    onDragEnd={item.isFront ? handleDragEnd : undefined}
                    custom={exitX}
                />
            {/snippet}
        </AnimatePresence>
    </div>
</Box>
