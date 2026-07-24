<script lang="ts">
	import { onDestroy } from 'svelte';
    import { Button } from "./ui/button";
    import { motion, type Variants } from "$lib/motion-start";

    interface Props {
        id?: string;
        onclick?: () => void;
    }

    const MotionButton = motion.create(Button);

    let isRefreshing = $state(false);
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    // let isPressing = false;

    let { id, onclick = () => {} }: Props = $props();

	function resetRefresh(delay = 0) {
		if (resetTimer !== undefined) clearTimeout(resetTimer);
		if (delay === 0) {
			isRefreshing = false;
			resetTimer = undefined;
			return;
		}

		resetTimer = setTimeout(() => {
			isRefreshing = false;
			resetTimer = undefined;
		}, delay);
	}

	onDestroy(() => {
		if (resetTimer !== undefined) clearTimeout(resetTimer);
	});

    const variants: Variants = {
        initial: { scale: 1 },
        pressed: { scale: 0.45 },
        refreshing: {
            rotate: -360,
            transition: {
                duration: 0.8,
                ease: "linear",
                repeat: Infinity,
                delay: 0.15,
            },
        },
        idle: { rotate: 0 },
    };
</script>

<MotionButton
    {id}
    onpointerdown={(event: PointerEvent) => {
        if (event.currentTarget instanceof Element) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
        // isPressing = true;
        isRefreshing = true;
    }}
    onpointerup={() => {
        // isPressing = false;
        resetRefresh(1000);
    }}
	onpointercancel={() => resetRefresh()}
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
        animate={isRefreshing ? "refreshing" : "idle"}
        ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
            d="M3 3v5h5"
        />
    </motion.svg>
</MotionButton>
