import { onDestroy } from 'svelte';
import type { AnimationScope } from '../types';
import { createScopedAnimate } from '../animate';

export function useAnimate<T extends Element = any>() {
	(node: T) => {
		const scope: AnimationScope<T> = {
			current: node, // hydrated by Svelte action
			animations: [],
		};

		const animate = createScopedAnimate(scope);

		onDestroy(() => {
			scope.animations.forEach((animation) => animation.stop);
		});

		return [scope, animate] as [AnimationScope<T>, typeof animate];
	};
}