<script lang="ts">
import { motion, type MotionStyle } from '$lib/motion-start';

const style: MotionStyle = {
	width: '100px',
	height: '100px',
	backgroundColor: '#f00',
	x: 0,
	borderRadius: '20px',
};

let isFirstFrame = true;
let content = $state('');
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
                content = typeof scale === 'string' ? 'Fail' : 'Success';
            }
            isFirstFrame = false;
        }}
        id="test"
    >
        {content}
    </motion.div>
</div>
