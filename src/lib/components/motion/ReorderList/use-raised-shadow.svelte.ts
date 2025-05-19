import { animate, type MotionValue, useMotionValue } from '$lib/motion-start';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: MotionValue<number>) {
	const boxShadow = useMotionValue(inactiveShadow);

	$effect(() => {
		let isActive = false;
		value.on('change', (latest) => {
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

	return boxShadow;
}
