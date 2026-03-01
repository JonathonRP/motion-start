<script lang="ts">
    /**
     * Test for instant layout transitions cycling through A -> AB -> A states
     */
    import { motion, useCycle } from '$lib/motion-start';

    const [state, cycleState] = useCycle('a', 'ab', 'a-back');

    const box = {
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'red',
    };

    const a = {
        ...box,
        width: 100,
        height: 100,
    };

    const b = {
        ...box,
        top: 100,
        left: 200,
        width: 200,
        height: 200,
        background: 'blue',
    };

    const showA = $derived(state === 'a' || state === 'ab' || state === 'a-back');
    const showB = $derived(state === 'ab');
</script>

<button id="next" onclick={() => cycleState()}>
    Next ({state})
</button>

{#if showA}
    <motion.div
        id="a"
        layoutId="box"
        style={a}
        transition={{ duration: 0.1 }}
    />
{/if}

{#if showB}
    <motion.div
        id="b"
        layoutId="box"
        style={b}
        transition={{ duration: 0.1 }}
    />
{/if}
