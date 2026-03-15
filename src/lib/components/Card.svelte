<script lang="ts">
    import {
        motion,
        useMotionValue,
        useTransform,
        type PanInfo,
        type Variants,
    } from "$lib/motion-start";

    let exitX = $state(0);
    const x = useMotionValue(0);
    const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-150, 0, 150], [-45, 0, 45], {
        clamp: false,
    });

    let {
        drag = false,
        frontCard = false,
        index = $bindable(0),
        custom = undefined,
        onDragEnd = undefined,
    }: {
        drag?: boolean | "x" | "y";
        frontCard?: boolean;
        index?: number;
        custom?: any;
        onDragEnd?: (event: PointerEvent, info: PanInfo) => void;
    } = $props();

    const variantsFrontCard: Variants = {
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: (custom: any) => ({ x: custom, opacity: 0, scale: 0.5 }),
    };
    const variantsBackCard: Variants = {
        initial: { scale: 0.3, y: 105, opacity: 0 },
        animate: { scale: 0.75, y: 30, opacity: 0.5 },
    };

    const isFront = $derived(frontCard ? variantsFrontCard : variantsBackCard);
</script>

<!-- Animate Presence Stack -->

<motion.div
    key={index}
    id="presswipe-{index}"
    style={{
        x,
        rotate,
    }}
    {drag}
    dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
    variants={isFront}
    initial="initial"
    animate="animate"
    {onDragEnd}
    exit="exit"
    {custom}
    transition={frontCard
        ? { type: "spring", stiffness: 300, damping: 20 }
        : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }}
    class="w-32 h-32 top-10 bg-white rounded-xl absolute text-black flex justify-center items-center select-none action-none {frontCard
        ? 'cursor-grab active:cursor-grabbing z-10'
        : 'z-0 pointer-none'}"
>
    {index}
</motion.div>
