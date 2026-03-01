<script lang="ts">
    import { motion, useMotionValue } from '$lib/motion-start';

    const style = {
        width: 100,
        height: 100,
        backgroundColor: '#f00',
        x: 0,
        borderRadius: 20,
    };

    let isFirstFrame = true;
    const content = useMotionValue('');
</script>

<div style="--a: #00F; --b: 100px; --c: 2; --d: 0.5;">
    <motion.div
        animate={{
            originX: 0,
            originY: 0,
            opacity: 'var(--d)',
            backgroundColor: ' var(--a)',
            scale: 'var(--c)',
            x: 'var(--b)',
        }}
        transition={{ duration: 0.1 }}
        {style}
        onUpdate={({ scale }) => {
            if (isFirstFrame) {
                content.set(typeof scale === 'string' ? 'Fail' : 'Success');
            }
            isFirstFrame = false;
        }}
        id="test"
    >
        {content.get()}
    </motion.div>
</div>
