import { animate, type MotionValue, useMotionValue } from '$lib/motion-start';

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)';

export function useRaisedShadow(value: () => MotionValue<number>) {
	const boxShadow = $derived(useMotionValue(inactiveShadow));

	$effect(() => {
		let isActive = false;
		value().onChange((latest) => {
			const wasActive = isActive;
			if (latest !== 0) {
				isActive = true;
				console.log(latest, wasActive, isActive);
				if (isActive !== wasActive) {
					animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)');
				}
			} else {
				isActive = false;
				console.log(latest, wasActive, isActive);
				if (isActive !== wasActive) {
					animate(boxShadow, inactiveShadow);
				}
			}
		});
	});

	return () => boxShadow;
}
