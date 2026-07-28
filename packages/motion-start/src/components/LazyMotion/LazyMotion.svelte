<!--based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
import type {
  FeatureBundle,
  LazyFeatureBundle,
} from "../../motion/features/types.js";

function isLazyBundle(features: FeatureBundle | LazyFeatureBundle): features is LazyFeatureBundle {
	return typeof features === 'function';
}
</script>

<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  import { setLazyContext } from "../../context/LazyContext.js";
  import { loadFeatures } from "../../motion/features/load-features.js";
  import type { CreateVisualElement } from "../../render/types.js";
  import type { LazyProps } from "./types.js";

  interface Props extends LazyProps {
    children: Snippet;
  }

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
  let { features, strict = false, children }: Props = $props();

  let loadedRenderer = $state<CreateVisualElement<any> | undefined>(undefined);

  function loadInitialFeatures() {
    if (!isLazyBundle(features)) {
      const { renderer, ...loadedFeatures } = features;
      loadedRenderer = renderer;
      loadFeatures(loadedFeatures);
    }
  }

  loadInitialFeatures();

  onMount(() => {
    if (!isLazyBundle(features)) return;

    let isActive = true;

    features().then(({ renderer, ...loadedFeatures }) => {
      if (!isActive) return;

      loadFeatures(loadedFeatures);
      loadedRenderer = renderer;
    });

    return () => {
      isActive = false;
    };
  });

  setLazyContext({
    get renderer() {
      return loadedRenderer;
    },
    get strict() {
      return strict;
    },
  });
</script>

{@render children()}
