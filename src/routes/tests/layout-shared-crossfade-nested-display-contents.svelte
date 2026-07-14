<script lang="ts">
import { page } from '$app/state';
import { AnimatePresence, motion, type MotionStyle } from '$lib/motion-start';

type LayoutType = boolean | 'position' | 'size' | 'preserve-aspect';

const toLayoutType = (value: string | null): LayoutType => {
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
};

const type = $derived(toLayoutType(page.url.searchParams.get('type')));
let isExpanded = $state(true);

const transition = { duration: 0.5, ease: () => 0.5 };

const box: MotionStyle = {
	position: 'absolute',
	top: '0px',
	left: '0px',
	background: 'red',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '200px',
	top: '100px',
	left: '200px',
};

const b: MotionStyle = {
	...box,
	top: '300px',
	left: '200px',
	width: '300px',
	height: '300px',
};

const childA: MotionStyle = {
	width: '100px',
	height: '100px',
	background: 'blue',
};

const childB: MotionStyle = {
	width: '100px',
	height: '100px',
	background: 'blue',
};

const items = $derived([
	{
		key: isExpanded ? 'a' : 'b',
		id: isExpanded ? 'a' : 'b',
		style: isExpanded ? a : b,
		backgroundColor: isExpanded ? '#f00' : '#0f0',
		borderRadius: isExpanded ? '0px' : '20px',
		childStyle: isExpanded ? childA : childB,
	},
]);
</script>

<AnimatePresence>
    {#each items as item (item.key)}
        <motion.div
            style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '500px',
                height: '400px',
            }}
        >
            <motion.div
                id={item.id}
                data-testid="box"
                layoutId="box"
                layout={type}
                style={{
                    ...item.style,
                    backgroundColor: item.backgroundColor,
                    borderRadius: item.borderRadius,
                }}
                {transition}
                onclick={() => (isExpanded = !isExpanded)}
            >
                <motion.div id="mid" layoutId="mid" style={{ display: 'contents' }} {transition}>
                    <motion.div
                        id="child"
                        layoutId="child"
                        style={item.childStyle}
                        {transition}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    {/each}
</AnimatePresence>
