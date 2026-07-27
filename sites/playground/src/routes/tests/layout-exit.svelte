<script lang="ts">
import { motion, AnimatePresence } from 'motion-start';
import { onMount } from 'svelte';

let visible = $state(true);

const animation = {
	x: 0,
	opacity: 0.5,
};

onMount(() => {
	const timer = setTimeout(() => {
		visible = false;
	}, 50);

	return () => clearTimeout(timer);
});
</script>

<AnimatePresence>
    {#if visible}
        <motion.div
        id="box"
        layout
        style={{ width: '100px', height: '100px', background: 'blue' }}
        transition={{ duration: 0.1 }}
        exit={animation}
        />
    {/if}
</AnimatePresence>
