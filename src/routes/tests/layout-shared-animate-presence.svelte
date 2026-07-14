<script lang="ts">
import { motion, useCycle, AnimatePresence, type MotionStyle } from '$lib/motion-start';

const [count, cycleCount] = useCycle(0, 1, 2, 3);
const currentCount = $derived(count());

const animate = [
	{
		backgroundColor: '#09f',
		borderRadius: '10px',
		opacity: 1,
	},
	{
		backgroundColor: '#90f',
		borderRadius: '100px',
		opacity: 0.5,
	},
	{
		backgroundColor: '#f09',
		borderRadius: '0px',
		opacity: 1,
	},
	{
		backgroundColor: '#9f0',
		borderRadius: '50px',
		opacity: 0.5,
	},
];

const styles: MotionStyle[] = [
	{
		width: '100px',
		height: '100px',
		top: '100px',
	},
	{
		width: '200px',
		height: '200px',
		left: '100px',
	},
	{
		width: '100px',
		height: '100px',
		left: 'calc(100vw - 100px)',
	},
	{
		width: '200px',
		height: '200px',
	},
];

const items = $derived([
	{
		key: `shape-${currentCount}`,
		id: `shape-${currentCount}`,
		index: currentCount,
	},
]);
</script>

<div
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; display: flex; justify-content: center; align-items: center;"
>
    <AnimatePresence>
        {#each items as item (item.key)}
            <motion.div
                initial={false}
                style={{
                    position: 'absolute',
                    ...styles[item.index],
                }}
                transition={{ duration: 10, ease: () => 0.25 }}
                animate={animate[item.index]}
                layoutId="box"
                id={item.id}
                onclick={() => cycleCount()}
            />
        {/each}
    </AnimatePresence>
</div>
