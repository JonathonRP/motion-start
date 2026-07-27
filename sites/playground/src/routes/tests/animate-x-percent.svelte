<svelte:options runes={true} />

<script lang="ts">
import { AnimatePresence, motion } from 'motion-start';
import { ref as createRef } from '$lib/motion-start/utils/ref.svelte';

let isVisible = $state(true);
let output = $state<Array<string | number>>([]);
const testRef = createRef<HTMLDivElement | null>(null);
</script>

<div style="height: 100px; width: 200px; display: flex;">
    <AnimatePresence>
        {#if isVisible}
            <motion.div
                id="test"
                ref={testRef}
                animate={{ x: '100%', y: '100%', rotate: '-30deg' }}
                style={{ width: '200px', background: 'red' }}
                onclick={() => (isVisible = false)}
                transition={{ duration: 2 }}
                onUpdate={({ x }) => {
                    output.push(x);
                }}
                onAnimationComplete={() => {
                    if (output[0] === '100%' && testRef.current) {
                        testRef.current.innerHTML = 'Error';
                    }
                }}
            />
        {/if}
    </AnimatePresence>
</div>
