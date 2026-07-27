import type { AnimationScope } from '../types.js';
import { createScopedAnimate } from '../animate/index.js';

export function useAnimate<T extends Element = Element>() {
	const scope: AnimationScope<T> = {
		current: null! as T, // hydrated by Svelte action
		animations: [],
	};

	const animate = createScopedAnimate(scope);

	$effect(() => () => {
		scope.animations.forEach((animation) => animation.stop());
	});

	return [scope, animate] as [AnimationScope<T>, typeof animate];
}
