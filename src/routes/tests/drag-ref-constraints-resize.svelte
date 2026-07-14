<svelte:options runes={true} />

<script lang="ts">
import { motion } from '$lib/motion-start';
import { ref as createRef } from '$lib/motion-start/utils/ref.svelte';

const constraintsRef = createRef<HTMLDivElement | null>(null);
let constraintsElement = $state<HTMLDivElement | null>(null);
let count = $state(0);

$effect(() => {
	constraintsRef.current = constraintsElement;
});
</script>

<div
    bind:this={constraintsElement}
    style="width: 50%; height: 300px; background: blue; border-radius: 20px; display: flex; justify-content: center; align-items: center; margin: 0 auto;"
    id="constraints"
>
    <motion.div
        drag
        dragConstraints={constraintsRef}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.1 }}
        style={{
            width: '200px',
            height: '200px',
            background: 'red',
            borderRadius: '20px',
        }}
        onclick={() => count++}
        id="box"
    />
</div>
