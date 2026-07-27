<script lang="ts">
/**
 * This test is for a bug in Chrome 93, the bounding box is incorrect while the
 * child of a transformed parent has a scale applied.
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1247858&q=getBoundingClientRect&can=1
 * The issue is fixed in Version 94.0.4606.61 (Official Build) (x86_64).
 */
import { motion, type MotionStyle } from 'motion-start';

let hover = $state(false);

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	bottom: '0px',
	right: '0px',
	background: 'red',
};

const a: MotionStyle = { ...box };

const b: MotionStyle = {
	...box,
	left: '50px',
};
</script>

<motion.div style={{ width: '400px', height: '400px', position: 'relative' }}>
    <motion.div
        id="parent"
        layout
        style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            left: '50%',
            top: '50%',
            transform: 'translateY(-50%)',
        }}
    >
        <motion.div
            id="mid"
            layout
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        >
            <motion.div
                id="box"
                data-testid="box"
                layout
                style={hover ? b : a}
                onclick={() => (hover = !hover)}
                transition={{ duration: 0.2, ease: () => 0.5 }}
            />
        </motion.div>
    </motion.div>
</motion.div>
