import { onDestroy } from 'svelte';
import type { AnimationScope } from '../types.js';
import { createScopedWaapiAnimate } from '../animators/waapi/animate-style.js';

export function useAnimateMini<T extends Element = Element>() {
	const scope: AnimationScope<T> = {
		current: null! as T,
		animations: [],
	};

	const animate = createScopedWaapiAnimate(scope);

	onDestroy(() => {
		scope.animations.forEach((animation) => animation.stop());
	});

	return [scope, animate] as [AnimationScope<T>, typeof animate];
}
