<svelte:options runes={true} />

<script lang="ts">
import { AnimatePresence, motion } from 'motion-start';
import { ref as createRef } from 'motion-start/utils/ref.svelte';

let isVisible = $state(true);
let output = $state<Array<string | number>>([]);
const testRef = createRef<HTMLDivElement | null>(null);
</script>

<div style="height: 100px; width: 100px; display: flex;">
    <AnimatePresence>
        {#if isVisible}
            <motion.div
                id="test"
                ref={testRef}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                style={{ width: '100px', background: 'red' }}
                transition={{ duration: 0.1 }}
                onUpdate={({ height }) => {
                    output.push(height);
                }}
                onAnimationComplete={() => {
                    if (output.length === 1 && testRef.current) {
                        testRef.current.innerHTML = 'Error';
                    }

                    requestAnimationFrame(() => {
                        if (testRef.current?.style.height !== 'auto') {
                            testRef.current!.innerHTML = 'Error';
                        }
                    });
                }}
                onclick={() => (isVisible = false)}
            />
        {/if}
    </AnimatePresence>
</div>
