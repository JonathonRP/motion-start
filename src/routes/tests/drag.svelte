<svelte:options runes={true} />

<script lang="ts">
import { motion } from '$lib/motion-start';
import { page } from '$app/state';
import { onMount } from 'svelte';

function getValueParam(name: string, isPercentage: boolean) {
	const param = page.url.searchParams.get(name);
	if (!param) return 0;
	return isPercentage ? `${param}%` : Number.parseFloat(param);
}

const axis = $derived.by(() => {
	const value = page.url.searchParams.get('axis');
	return value === 'x' || value === 'y' ? value : undefined;
});
const lock = $derived(page.url.searchParams.get('lock') === 'true');
const isPercentage = $derived(Boolean(page.url.searchParams.get('percentage')));
const top = $derived(Number.parseFloat(page.url.searchParams.get('top') ?? '') || undefined);
const left = $derived(Number.parseFloat(page.url.searchParams.get('left') ?? '') || undefined);
const right = $derived(Number.parseFloat(page.url.searchParams.get('right') ?? '') || undefined);
const bottom = $derived(Number.parseFloat(page.url.searchParams.get('bottom') ?? '') || undefined);
const snapToOrigin = $derived(Boolean(page.url.searchParams.get('return')));
const x = $derived(getValueParam('x', isPercentage));
const y = $derived(getValueParam('y', isPercentage));
const layout = $derived.by(() => {
	const value = page.url.searchParams.get('layout');
	if (value === 'true') return true;
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : undefined;
});

onMount(() => {
	window.scrollTo(0, 100);
});
</script>

<div style="height: 2000px; padding-top: 100px;">
    <motion.div
        id="box"
        data-testid="draggable"
        drag={axis ?? true}
        dragElastic={0}
        dragMomentum={false}
        dragConstraints={{ top, left, right, bottom }}
        dragSnapToOrigin={snapToOrigin}
        dragDirectionLock={lock}
        layout={layout}
        initial={{
            width: '50px',
            height: '50px',
            background: 'red',
            x,
            y,
        }}
        style={{
            width: '50px',
            height: '50px',
            background: 'red',
        }}
    />
</div>
