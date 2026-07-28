<script lang="ts">
import { motion, AnimatePresence, type LayoutProps, type MotionStyle } from 'motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));
let state = $state(true);

const transition = { duration: 1, ease: () => 0.5 };

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
		key: state ? 'a' : 'b',
		id: state ? 'a' : 'b',
		style: state ? a : b,
		backgroundColor: state ? '#f00' : '#0f0',
		borderRadius: state ? '0px' : '20px',
		childStyle: state ? childA : childB,
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
                transition={transition}
                onclick={() => (state = !state)}
            >
                <motion.div
                    id="child"
                    layoutId="child"
                    transition={transition}
                    style={item.childStyle}
                />
            </motion.div>
        </motion.div>
    {/each}
</AnimatePresence>
