<svelte:options runes={true} />

<script lang="ts">
import { motion, useMotionValue } from 'motion-start';
import { ref as createRef } from 'motion-start/utils/ref.svelte';
import { page } from '$app/state';
import { onMount } from 'svelte';

const containerRef = createRef<HTMLDivElement | null>(null);
const layout = $derived.by(() => {
	const value = page.url.searchParams.get('layout');
	if (value === 'true') return true;
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : undefined;
});
const x = useMotionValue('100%');

let dragging = $state(false);
let siblingShifted = $state(false);

onMount(() => {
	window.scrollTo(0, 100);
	const timer = setInterval(() => {
		siblingShifted = !siblingShifted;
	}, 200);

	return () => clearInterval(timer);
});
</script>

<div style="height: 2000px; padding-top: 100px;">
    <motion.div data-testid="constraint" style={{ width: '200px', height: '200px', background: 'blue' }} ref={containerRef}>
        <motion.div
            id="box"
            data-testid="draggable"
            drag
            dragElastic={0}
            dragMomentum={false}
            style={{
                width: '50px',
                height: '50px',
                background: dragging ? 'yellow' : 'red',
                x,
            }}
            dragConstraints={containerRef}
            layout={layout}
            onDragStart={() => (dragging = true)}
            onDragEnd={() => (dragging = false)}
        />
    </motion.div>
</div>

<motion.div
    layout
    style={{
        width: '200px',
        height: '200px',
        borderRadius: '20px',
        background: 'blue',
        position: 'relative',
        left: siblingShifted ? '100px' : '0',
    }}
/>
