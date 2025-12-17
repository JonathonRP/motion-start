<script lang="ts">
import { motion } from '$lib/motion-start';
</script>

<div id="gestures" style="display:grid; gap:16px;">
    <div id="drag-area" class="container">
        <motion.div
            id="draggable"
            class="draggable"
            drag={true}
            dragConstraints={{
                top: 0,
                left: 0,
                right: 220,
                bottom: 120,
            }}
            whileDrag={{
                scale: 1.1,
                cursor: "grabbing",
            }}
        >
            Drag me
        </motion.div>
    </div>

    <motion.div
        id="hover-box"
        class="box"
        whileHover={{
            scale: 1.05,
            backgroundColor: "#fde68a",
        }}
        transition={{ duration: 0.2 }}
    >
        Hover me
    </motion.div>

    <motion.div
        id="tap-box"
        class="box"
        whileTap={{
            scale: 0.95,
            backgroundColor: "#fca5a5",
        }}
        transition={{ duration: 0.2 }}
    >
        Tap me
    </motion.div>
</div>

<style>
    .container {
        width: 300px;
        height: 200px;
        border: 1px solid #ccc;
        position: relative;
    }
    .draggable {
        width: 80px;
        height: 80px;
        background: #0ea5e9;
        position: absolute;
        border-radius: 8px;
        display: grid;
        place-items: center;
        color: white;
        font-weight: 500;
        user-select: none;
    }
    .box {
        width: 120px;
        height: 60px;
        background: #e5e7eb;
        border-radius: 6px;
        display: grid;
        place-items: center;
        user-select: none;
        cursor: pointer;
    }
</style>
