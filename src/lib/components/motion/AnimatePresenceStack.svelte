<!-- https://codesandbox.io/p/sandbox/gm9n3c?file=/src/index.js -->

<script lang="ts">
import Card from '$lib/components/Card.svelte';
import { AnimatePresence } from '$lib/motion-start';
import Box from '../Box.svelte';

let index = $state(0);
let mint = $derived(index + 1);
let exitDirection = $state(0);
</script>

<Box>
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <AnimatePresence initial={false} custom={exitDirection}>
            {#each [
                { key: index, isFront: true },
                { key: mint, isFront: false },
            ] as item (item.key)}
                <Card
                    bind:index={
                        () => item.key,
                        (value) => { index = value; }
                    }
                    drag={item.isFront ? "x" : false}
                    frontCard={item.isFront}
                    bind:exitX={exitDirection}
                />
            {/each}
        </AnimatePresence>
    </div>
</Box>
