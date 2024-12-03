<script>
    import { motion } from "$lib/motion-start";
</script>

<motion.div
    animate={{
        x: [0, 100, 100, 0, 0],
        y: [0, 0, 100, 100, 0],
        backgroundColor: ["#fd3", "#60f", "#fd3"],
    }}
    transition={{ duration: 4, ease: "linear" }}
    class="w-20 h-20 rounded-xl"
></motion.div>
