<script lang="ts">
import { motion } from 'motion-start';
import { onMount } from 'svelte';

let state = $state(true);

onMount(() => {
	state = !state;
});
</script>

<motion.div
    id="parent"
    drag
    dragElastic={0}
    dragMomentum={false}
    layout
    style={{
        width: '200px',
        height: '200px',
        background: 'red',
    }}
>
    <motion.div
        id="child"
        layout
        style={{ width: '100px', height: '100px', background: 'blue' }}
    />
</motion.div>
