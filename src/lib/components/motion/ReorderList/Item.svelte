<script lang="ts">
    import { Reorder, useMotionValue } from "$lib/motion-start";
    import { useRaisedShadow } from "./use-raised-shadow.svelte";

    let { item } = $props();

    const y = useMotionValue(0);
    const boxShadow = $derived.by(useRaisedShadow(() => y));
</script>

<Reorder.Item
    class="p-0 m-0 font-medium text-2xl rounded-[5px] mb-[10px] w-full py-[15px] px-[18px] bg-white text-black flex justify-between items-center shrink-0 cursor-grab select-none"
    value={item}
    style={{ boxShadow, y }}
>
    <span>{item}</span>
</Reorder.Item>
