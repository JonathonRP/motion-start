<script>
    import { motion } from "$lib/motion-start";

    let isOn = false;
    const toggleSwitch = () => (isOn = !isOn);
</script>

<div
    class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
>
    <button class="switch" class:isOn onclick={toggleSwitch}>
        <motion.div layout class="handle" />
    </button>
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

    .isOn {
        justify-content: flex-end;
    }

    /* .switch[data-active="true"] {
        justify-content: flex-end;
    } */

    :global(.handle) {
        width: 3rem;
        height: 3rem;
        background-color: white;
        border-radius: 40px;
    }
</style>
