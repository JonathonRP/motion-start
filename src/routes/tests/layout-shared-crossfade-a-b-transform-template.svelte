<script lang="ts">
import { motion, AnimatePresence, type LayoutProps, type MotionStyle } from '$lib/motion-start';
import { page } from '$app/state';

function parseLayoutProp(value: string | null): LayoutProps['layout'] {
	if (!value || value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'position' || value === 'size' || value === 'preserve-aspect') return value;
	return true;
}

const type = $derived(parseLayoutProp(page.url.searchParams.get('type')));
let state = $state(true);

const box: MotionStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	background: 'red',
};

const a: MotionStyle = {
	...box,
	width: '100px',
	height: '200px',
};

const b: MotionStyle = {
	...box,
	top: '50%',
	left: '50%',
	width: '300px',
	height: '300px',
};

const items = $derived([
	{
		key: state ? 'a' : 'b',
		id: state ? 'a' : 'b',
		style: state ? a : b,
		backgroundColor: state ? '#f00' : '#0f0',
		borderRadius: state ? '0px' : '20px',
	},
]);
</script>

<motion.div
    style={{
        position: 'relative',
        width: '500px',
        height: '500px',
        backgroundColor: 'blue',
    }}
>
    <AnimatePresence>
        {#each items as item (item.key)}
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
                transition={{ duration: 1, ease: () => 0.5 }}
                onclick={() => (state = !state)}
                transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
            />
        {/each}
    </AnimatePresence>
</motion.div>
