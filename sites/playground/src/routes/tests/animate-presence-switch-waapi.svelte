<script lang="ts">
import { AnimatePresence, motion, useMotionValue } from 'motion-start';

const count = useMotionValue(0);
let state = $state(0);
</script>

<button
    id="switch"
    onclick={() => state = state === 0 ? 1 : 0}
>
    Switch
</button>
<div>
    Animation count: <motion.span id="count">{count.get()}</motion.span>
</div>
<AnimatePresence initial={false}>
    {#key state}
        <motion.div
            id={state.toString()}
            class="item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationStart={() => count.set(count.get() + 1)}
        >
            {state}
        </motion.div>
    {/key}
</AnimatePresence>
