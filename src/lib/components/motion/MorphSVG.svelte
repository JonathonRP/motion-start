<script>
    import { motion } from "$lib/motion-start";
</script>

<svg
    width={200}
    height={200}
    class="bg-white rounded-3xl"
    stroke="#70f"
    stroke-width={20}
    stroke-linecap="round"
    fill="transparent"
>
    <motion.path
        animate={{
            d: [
                "M 40,40 Q 160,40 160,160",
                "M 160,40 Q 100,100 40,160",
                "M 160,160 Q 100,160 40,160",
                "M 160,40 Q 100,160 40,40",
                "M 160,40 Q 100,40 40,40",
                "M 40,40 Q 160,40 160,160",
            ],
        }}
        transition={{
            repeat: Infinity,
            ease: "easeInOut",
            duration: 6,
            times: [0, 0.16, 0.33, 0.5, 0.66, 0.83],
        }}
        d="M 40,40 Q 160,40 160,160"
    />
</svg>
