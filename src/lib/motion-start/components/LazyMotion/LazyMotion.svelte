<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { setDomContext } from '../../context/DOMcontext';
import { LazyContext } from '../../context/LazyContext';
import { loadFeatures } from '../../motion/features/definitions';
import type { FeatureBundle } from '../../motion/features/types';
import type { LazyProps } from './index.js';
import type { LazyFeatureBundle } from './types';

type $$Props = LazyProps;

/**
 * Used in conjunction with the `m` component to reduce bundle size.
 *
 * `m` is a version of the `motion` component that only loads functionality
 * critical for the initial render.
 *
 * `LazyMotion` can then be used to either synchronously or asynchronously
 * load animation and gesture support.
 *
 * ```jsx
 * // Synchronous loading
 * import { LazyMotion, m, domAnimations } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={domAnimations}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 *
 * // Asynchronous loading
 * import { LazyMotion, m } from "framer-motion"
 *
 * function App() {
 *   return (
 *     <LazyMotion features={() => import('./path/to/domAnimations')}>
 *       <m.div animate={{ scale: 2 }} />
 *     </LazyMotion>
 *   )
 * }
 * ```
 *
 * @public
 */
let { features, strict = false, isCustom = false }: $$Props = $props();

let _ = $state(!isLazyBundle(features));
let loadedRenderer = $state<any>(undefined);

function isLazyBundle(features: FeatureBundle | LazyFeatureBundle): features is LazyFeatureBundle {
	return typeof features === 'function';
}

/**
 * If this is a synchronous load, load features immediately
 */
$effect(() => {
	if (!isLazyBundle(features) && _) {
		const { renderer, ...loadedFeatures } = features;
		loadedRenderer = { current: renderer };
		loadFeatures(loadedFeatures);
	}
});

$effect(() => {
	if (isLazyBundle(features)) {
		features().then(({ renderer, ...loadedFeatures }) => {
			loadFeatures(loadedFeatures);
			loadedRenderer = { current: renderer };

			// @ts-expect-error
			setIsLoaded(true);
		});
	}
});

let context = writable({ renderer: loadedRenderer?.current, strict });
setContext(LazyContext, context);
setDomContext('Lazy', isCustom, context);

$effect(() => {
	context.set({ renderer: loadedRenderer?.current, strict });
});
</script>

<slot />
