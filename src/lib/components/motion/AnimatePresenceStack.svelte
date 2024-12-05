<script>
    import { AnimatePresence } from "$lib/motion-start";
    import Card from "$lib/components/Card.svelte";
    let index = 0;
    $: mint = index + 1;
</script>

<div
    class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
>
    <AnimatePresence initial={false} list={[{ key: index }]}>
        <Card bind:index={mint} frontCard={false} />
        <Card bind:index drag="x" frontCard={true} />
    </AnimatePresence>
</div>
