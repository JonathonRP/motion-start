<script lang="ts">
    import { Motion, useMotionValue, useTransform } from "$lib/motion-start";

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const height = 70;
    const padding = 10;
    const size = 150;
    let scrollY = useMotionValue(0);
    function getHeight(items: number[]) {
        const totalHeight = items.length * height;
        const totalPadding = (items.length - 1) * padding;
        const totalScroll = totalHeight + totalPadding;
        return totalScroll;
    }
    let width = useTransform(
        scrollY,
        [0, -getHeight(items) + size],
        ["calc(0% - 0px)", "calc(100% - 40px)"],
    );
</script>

<!-- style={{ transform: "translateZ(0)" }} -->
<Motion.div
    whileTap={{ cursor: "grabbing" }}
    class="w-[150px] h-[150px] rounded-[30px] border border-primary overflow-hidden cursor-grab relative"
>
    <Motion.div
        style={{
            width: "150px",
            height: useMotionValue(getHeight(items)),
            y: scrollY,
        }}
        drag="y"
        dragConstraints={{
            top: -getHeight(items) + size,
            bottom: 0,
        }}
        class="w-[150px]"
    >
        {#each items as item (item)}
            <div
                style="border-radius:20px; height: {height}px; top:{(height +
                    padding) *
                    item}px; "
                class="bg-[#fff] w-[150px] absolute flex justify-center items-center text-black"
            >
                {item}
            </div>
        {/each}
    </Motion.div>
</Motion.div>
<Motion.div
    style={{
        width,
        transformOrigin: "0%",
        position: "absolute",
        left: "25px",
        top: "10px",
    }}
    class="h-[6px] bg-[#fff] rounded-full"
></Motion.div>
