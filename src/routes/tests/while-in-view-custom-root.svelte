<script lang="ts">
    import { motion } from '$lib/motion-start';

    let containerRef: HTMLDivElement | undefined = $state();
</script>

<div
    id="container"
    bind:this={containerRef}
    style="width: 300px; overflow: scroll; display: flex;"
>
    <div style="flex: 0 0 400px;"></div>
    <motion.div
        id="box"
        initial={false}
        transition={{ duration: 0.01 }}
        animate={{ background: 'rgba(255,0,0,1)' }}
        whileInView={{ background: 'rgba(0,255,0,1)' }}
        viewport={{ root: containerRef }}
        style={{ width: 100, height: 100, flexShrink: 0 }}
    />
</div>
