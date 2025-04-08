<svelte:options runes={false} />

<script lang="ts">
    import { motion } from "$lib/motion-start";
    import { cva, type VariantProps } from "class-variance-authority";
    import { cn } from "$lib/utils";

    interface DockProps extends VariantProps<typeof dockVariants> {
        className?: string;
        magnification?: number;
        distance?: number;
        direction?: "top" | "middle" | "bottom";
    }

    let className: DockProps["className"] = undefined;
    export { className as class };
    export let magnification: DockProps["magnification"] = 60;
    export let distance: DockProps["distance"] = 140;
    export let direction: DockProps["direction"] = "middle";

    const dockVariants = cva(
        "mx-auto w-max mt-8 h-[58px] p-2 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md",
    );

    let mouseX = Number.POSITIVE_INFINITY;
    function handleMouseMove(e: MouseEvent) {
        mouseX = e.pageX;
    }

    function handleMouseLeave() {
        mouseX = Number.POSITIVE_INFINITY;
    }

    let dockClass = cn(dockVariants({ className }), {
        "items-start": direction === "top",
        "items-center": direction === "middle",
        "items-end": direction === "bottom",
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<motion.div
    onmousemove={(e) => handleMouseMove(e)}
    onmouseleave={handleMouseLeave}
    class={dockClass}
>
    <slot {mouseX} {magnification} {distance}>
        <!-- Your Content -->
        Default
    </slot>
</motion.div>
