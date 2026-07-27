<script lang="ts">
    import { motion, motionValue, MotionConfig } from '$lib/motion-start';
    import { page } from '$app/state';

    const isStatic = $derived(Boolean(page.url.searchParams.get('isStatic')));
    const xValue = motionValue(50);
</script>

<MotionConfig {isStatic}>
    <svg
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
    >
        <motion.rect
            height="100"
            width="100"
            x={xValue}
            y={50}
            data-testid="rotate"
            style={{ rotate: 45 }}
        />
        <motion.rect
            height="100"
            width="100"
            x={50}
            y={200}
            data-testid="scale"
            style={{ scale: 2 }}
        />
        <motion.rect
            height="100"
            width="100"
            x={50}
            y={350}
            data-testid="translate"
            style={{ x: 100 }}
        />
    </svg>
</MotionConfig>
