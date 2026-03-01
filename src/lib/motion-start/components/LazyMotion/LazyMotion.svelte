<!--based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
  function isLazyBundle(
    features: FeatureBundle | LazyFeatureBundle,
  ): features is LazyFeatureBundle {
    return typeof features === "function";
  }
</script>

<script lang="ts">
  import { untrack, type Snippet } from "svelte";

  import { setLazyContext } from "../../context/LazyContext";
  import { loadFeatures } from "../../motion/features/load-features";
  import type {
    FeatureBundle,
    LazyFeatureBundle,
  } from "../../motion/features/types";
  import type { CreateVisualElement } from "../../render/types";
  import type { LazyProps } from "./types";

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

  let loadedRenderer: CreateVisualElement<any> | undefined = undefined;

  if (!isLazyBundle(features)) {
    const { renderer, ...loadedFeatures } = features;
    loadedRenderer = renderer;
    loadFeatures(loadedFeatures);
  }

  setLazyContext({
    get current() {
      return {
        renderer: loadedRenderer,
        strict: strict!,
      };
    },
  });
</script>

{@render children()}
