<script lang="ts">
import { page } from '$app/state';
import { motion, type LayoutProps } from '$lib/motion-start';

type DragAxis = boolean | 'x' | 'y';

const axis = $derived.by<DragAxis>(() => {
	const value = page.url.searchParams.get('axis');
	return value === 'x' || value === 'y' ? value : true;
});
const lock = $derived(page.url.searchParams.get('lock'));
const parseConstraint = (value: string | null) => {
	const parsed = Number.parseFloat(value ?? '');
	return Number.isFinite(parsed) ? parsed : undefined;
};
const top = $derived(parseConstraint(page.url.searchParams.get('top')));
const left = $derived(parseConstraint(page.url.searchParams.get('left')));
const right = $derived(parseConstraint(page.url.searchParams.get('right')));
const bottom = $derived(parseConstraint(page.url.searchParams.get('bottom')));
const layout = $derived.by<LayoutProps['layout']>(() => {
	const value = page.url.searchParams.get('layout');
	return value === 'position' || value === 'size' || value === 'preserve-aspect' ? value : undefined;
});
</script>

<svg style="width: 500px; height: 500px;">
	<motion.circle
		id="box"
		data-testid="draggable"
		drag={axis}
		dragElastic={0}
		dragMomentum={false}
		dragConstraints={{ top, left, right, bottom }}
		dragDirectionLock={!!lock}
		fill="red"
		cx={50}
		cy={50}
		r={20}
		{layout}
	/>
</svg>
