<script>
    import { motion } from "$lib/motion-start";
    // import Motion from "$lib/motion-start/motion/MotionSSR.svelte";

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30,
    };

    let active = false;

    function toggleSwitch() {
        active = !active;
    }
</script>

<div
    class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
>
    <svelte:boundary onerror={console.log}>
        <button class="switch" data-active={active} onclick={toggleSwitch}>
            <motion.div
                silly={2 * !active}
                layout
                transition={spring}
                onLayoutUpdate={(...args) => console.log("change", args)}
                class="handle"
            />
        </button>

        {#snippet failed(error, reset)}
            <p>broken, check console</p>
        {/snippet}
    </svelte:boundary>
</div>

<style>
    .switch {
        all: unset;
        width: 8rem;
        height: 3rem;
        background-color: gainsboro;
        display: flex;
        justify-content: flex-start;
        border-radius: 50px;
        padding: 0.5rem;
        cursor: pointer;
    }

    .switch {
        display: flex;
        justify-content: flex-start;
    }

    .switch[data-active="true"] {
        justify-content: flex-end;
    }

    :global(.handle) {
        width: 3rem;
        height: 3rem;
        background-color: white;
        border-radius: 40px;
    }
</style>
