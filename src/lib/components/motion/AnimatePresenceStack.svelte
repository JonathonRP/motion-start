<script>
    import Box from "../Box.svelte";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { AnimatePresence, AnimatePresenceLegacy } from "$lib/motion-start";
    import Card from "$lib/components/Card.svelte";
    let index = 0;
    let use_legacy= false
    $: mint = index + 1;
</script>
<div class="flex items-center space-x-2">
    <Switch id="airplane-mode" bind:checked={use_legacy}/>
    <Label for="airplane-mode">Use Legacy</Label>
  </div>
{#if use_legacy}
<Box>
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <AnimatePresenceLegacy initial={false} list={[{ key: index }]}>
            <Card bind:index={mint} frontCard={false} />
            <Card bind:index drag="x" frontCard={true} />
        </AnimatePresenceLegacy>
    </div>
</Box>
{:else}
<Box>
    <div
        class="w-64 h-64 relative bg-gray-700/40 rounded-lg flex justify-center items-center"
    >
        <AnimatePresence initial={false} list={[{ key: index }]}>
            <Card bind:index={mint} frontCard={false} />
            <Card bind:index drag="x" frontCard={true} />
        </AnimatePresence>
    </div>
</Box>
{/if}