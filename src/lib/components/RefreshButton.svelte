<script lang="ts">
    import { Button } from "./ui/button";
    import { motion, type Variants } from "$lib/motion-start";

    const MotionButton = motion.create(Button);

    let isRefreshing = false;
    // let isPressing = false;

    export let id = null;
    export let onclick = () => {};

    const variants: Variants = {
        initial: { scale: 1 },
        pressed: { scale: 0.45 },
        refreshing: {
            rotate: -360,
            transition: {
                duration: 1.2,
                ease: "linear",
                repeat: Infinity,
                delay: 0.25,
            },
        },
    };
</script>

<MotionButton
    {id}
    onpointerdown={async () => {
        // isPressing = true;
        isRefreshing = true;
    }}
    onpointerup={() => {
        // isPressing = false;
        new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
            isRefreshing = false;
        });
    }}
    whileTap="pressed"
    {variants}
    transition={{ duration: 0.2 }}
    {onclick}
    variant="outline"
    class="bg-gray-700/30 border-white/30 text-white"
    size="sm"
>
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-rotate-ccw"
        {variants}
        animate={isRefreshing ? "refreshing" : undefined}
        ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
            d="M3 3v5h5"
        />
    </motion.svg>
</MotionButton>
