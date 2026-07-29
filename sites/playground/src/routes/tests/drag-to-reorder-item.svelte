<script lang="ts">
	import { Reorder, animate, useMotionValue } from 'motion-start';

	let {
		item,
		axis,
		useLayoutId = false,
		freeDrag = false,
		onDragInvalidate,
	}: {
		item: string;
		axis: 'x' | 'y';
		useLayoutId?: boolean;
		freeDrag?: boolean;
		onDragInvalidate?: () => void;
	} = $props();

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const axisValue = $derived(axis === 'y' ? y : x);
	const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';
	const boxShadow = useMotionValue(inactiveShadow);

	$effect(() => {
		let isActive = false;

		return axisValue.on('change', (latest) => {
			const wasActive = isActive;
			if (latest !== 0) {
				isActive = true;
				if (isActive !== wasActive) {
					animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)');
				}
			} else {
				isActive = false;
				if (isActive !== wasActive) {
					animate(boxShadow, inactiveShadow);
				}
			}
		});
	});
</script>

<Reorder.Item
	value={item}
	id={item}
	layoutId={useLayoutId ? item : undefined}
	drag={freeDrag ? true : undefined}
	dragConstraints={freeDrag ? { top: 0, left: 0, right: 0, bottom: 0 } : undefined}
	dragElastic={freeDrag ? 1 : undefined}
	onDrag={onDragInvalidate}
	style={{ boxShadow, y }}
	dragTransition={{ bounceStiffness: 2000, bounceDamping: 10000 }}
	transition={{ duration: 0.1 }}
>
	<span>{item}</span>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 39" width="39" height="39">
		<path d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z" fill="#CCC"></path>
		<path d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z" fill="#CCC"></path>
		<path d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z" fill="#CCC"></path>
		<path d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z" fill="#CCC"></path>
		<path d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z" fill="#CCC"></path>
		<path d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z" fill="#CCC"></path>
		<path d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z" fill="#CCC"></path>
		<path d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z" fill="#CCC"></path>
		<path d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z" fill="#CCC"></path>
	</svg>
</Reorder.Item>
