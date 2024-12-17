import { onDestroy } from 'svelte';
import type { AnimationScope } from '../types';
import { createScopedWaapiAnimate } from '../animators/waapi/animate-style.svelte';

export function useAnimateMini<T extends Element = any>() {
	(node: T) => {
		const scope: AnimationScope<T> = {
			current: node, // hydrated by Svelte action
			animations: [],
		};

		const animate = createScopedWaapiAnimate(scope);

		onDestroy(() => {
			scope.animations.forEach((animation) => animation.stop);
		});

		return [scope, animate] as [AnimationScope<T>, typeof animate];
	};
}
