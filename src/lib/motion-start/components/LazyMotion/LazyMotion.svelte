<!--based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" context="module" module>
  function isLazyBundle(
    features: FeatureBundle | LazyFeatureBundle,
  ): features is LazyFeatureBundle {
    return typeof features === "function";
  }
</script>

<script lang="ts">
  import { untrack, type Snippet } from "svelte";

  import { LazyContext } from "../../context/LazyContext";
  import { loadFeatures } from "../../motion/features/load-features";
  import type {
    FeatureBundle,
    LazyFeatureBundle,
  } from "../../motion/features/types";
  import type { CreateVisualElement } from "../../render/types";
  import type { LazyProps } from "./types";
  import type { Ref } from "../../utils/safe-react-types";

  interface Props extends LazyProps {
    children?: Snippet;
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
  let { features, strict, children }: Props = $props();

  let _ = !isLazyBundle(features);
  let loadedRenderer: Ref<undefined | CreateVisualElement<any>> = {
    current: undefined,
  };

  /**
   * If this is a synchronous load, load features immediately
   */
  if (!isLazyBundle(features) && _) {
    const { renderer, ...loadedFeatures } = features;
    loadedRenderer.current = renderer;
    loadFeatures(loadedFeatures);
  }

  $effect.pre(() => {
    if (isLazyBundle(features)) {
      features().then(({ renderer, ...loadedFeatures }) => {
        loadFeatures(loadedFeatures);
        loadedRenderer.current = renderer;

        _ = true;
      });
    }
  });

  $effect(() => {
    LazyContext.Provider = {
      renderer: loadedRenderer.current!,
      strict: strict!,
    };
  });
</script>

{@render children?.()}
