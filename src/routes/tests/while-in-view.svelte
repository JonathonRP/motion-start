<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';

    const amount = $derived(page.url.searchParams.get('amount') || undefined);
    const once = $derived(page.url.searchParams.get('once') ? true : undefined);
    const margin = $derived(page.url.searchParams.get('margin') || undefined);
    const disableFallback = $derived(page.url.searchParams.get('disableFallback') || false);

    let inViewport = $state(false);
</script>

<div style="padding-top: 700px;">
    <motion.div
        id="box"
        initial={false}
        transition={{ duration: 0.01 }}
        animate={{ background: 'rgba(255,0,0,1)' }}
        whileInView={{ background: 'rgba(0,255,0,1)' }}
        viewport={{ amount, once, margin, fallback: !disableFallback }}
        style={{ width: 100, height: 100 }}
        onViewportEnter={() => inViewport = true}
        onViewportLeave={() => inViewport = false}
    >
        {inViewport ? 'In' : 'Out'}
    </motion.div>
</div>
