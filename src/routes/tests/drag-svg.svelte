<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    const axis = $derived(page.url.searchParams.get('axis'));
    const lock = $derived(page.url.searchParams.get('lock'));
    const top = $derived(parseFloat(page.url.searchParams.get('top') || '') || undefined);
    const left = $derived(parseFloat(page.url.searchParams.get('left') || '') || undefined);
    const right = $derived(parseFloat(page.url.searchParams.get('right') || '') || undefined);
    const bottom = $derived(parseFloat(page.url.searchParams.get('bottom') || '') || undefined);
    const layout = $derived(page.url.searchParams.get('layout') || undefined);
</script>

<svg style="width: 500px; height: 500px;">
    <motion.circle
        id="box"
        data-testid="draggable"
        drag={axis ? axis : true}
        dragElastic={0}
        dragMomentum={false}
        dragConstraints={{ top, left, right, bottom }}
        dragDirectionLock={!!lock}
        fill="red"
        cx={50}
        cy={50}
        r={20}
        {layout}
    />
</svg>
