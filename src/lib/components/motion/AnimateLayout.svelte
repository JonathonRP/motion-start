<script>
    import Box from "../Box.svelte";
    import { motion } from "$lib/motion-start";

    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30,
    };

    let active = false;

    function toggleSwitch() {
        active = !active;
    }

    // active={1 * !active} do we still need this??
</script>

<Box>
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <button class="switch" data-active={active} onclick={toggleSwitch}>
            <motion.div
                active={1 * !active}
                layout
                class="handle"
                transition={spring}
            />
        </button>
    </div>
</Box>

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
