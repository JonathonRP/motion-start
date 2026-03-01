<script lang="ts">
    import { motion } from '$lib/motion-start';
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
        width: 200,
        height: 200,
        background: 'red',
    }}
>
    <motion.div
        id="child"
        layout
        style={{ width: 100, height: 100, background: 'blue' }}
    />
</motion.div>
