<script lang="ts">
    import { AnimatePresence, motion, useMotionValue } from '$lib/motion-start';

    const count = useMotionValue(0);
    let state = $state(0);

    const items = $derived([{ key: state, id: state.toString() }]);
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
<AnimatePresence initial={false} values={items}>
    {#snippet children({ item })}
        <motion.div
            id={item.id}
            class="item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationStart={() => count.set(count.get() + 1)}
        >
            {item.key}
        </motion.div>
    {/snippet}
</AnimatePresence>
