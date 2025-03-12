<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" generics="TProps, Instance, RenderState">
  import { MotionConfigContext } from "../context/MotionConfigContext";
  import { MotionContext } from "../context/MotionContext";
  import { useVisualElement } from "./utils/use-visual-element.svelte";
  import { useMotionRef } from "./utils/use-motion-ref";
  import { useCreateMotionContext } from "../context/MotionContext/create.svelte";
  import { isBrowser } from "../utils/is-browser";
  import type { Ref } from "../utils/safe-react-types";
  import { useContext } from "../context/use";
  import {
    getProjectionFunctionality,
    useLayoutId,
    useStrictMode,
    type MotionComponentConfig,
    type MotionComponentProps,
  } from "./index.svelte";
  import { untrack, type Component as ComponentType } from "svelte";
  import type { MotionProps } from "./types";

  type Props = {
    props: MotionComponentProps<TProps>;
    ref?: Ref<Instance>;
  };

  let {
    preloadedFeatures,
    createVisualElement,
    useVisualState,
    useRender: Renderer,
    Component,
    props,
    ref: externalRef = $bindable(),
  }: Props & MotionComponentConfig<Instance, RenderState> = $props();

  /**
   * If we need to measure the element we load this functionality in a
   * separate class component in order to gain access to getSnapshotBeforeUpdate.
   */
  let MeasureLayout: undefined | ComponentType<MotionProps> = $state();

  const configAndProps = $derived({
    ...useContext(MotionConfigContext),
    ...props,
    layoutId: useLayoutId(props),
  });

  const { isStatic } = $derived(configAndProps);

  const context = useCreateMotionContext<Instance>(props);

  const visualState = $derived(useVisualState(props, isStatic));

  if (!isStatic && isBrowser) {
    useStrictMode(configAndProps, preloadedFeatures);

    const layoutProjection = $derived(
      getProjectionFunctionality(configAndProps),
    );

    $effect(() => {
      MeasureLayout = layoutProjection?.MeasureLayout;
    });

    /**
     * Create a VisualElement for this component. A VisualElement provides a common
     * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
     * providing a way of rendering to these APIs outside of the React render loop
     * for more performant animations and interactions
     */
    context.visualElement = useVisualElement<Instance, RenderState>(
      Component,
      () => visualState,
      () => configAndProps,
      createVisualElement,
      () => layoutProjection?.ProjectionNode,
    );
  }

  MotionContext.Provider = context;

  // const motionRef = $derived(
  //   useMotionRef(visualState, context.visualElement, externalRef),
  // );

  // $effect(() => {
  //   return () => {
  //     console.log("dismount");
  //     // Since useMotionRef is not called on destroy, the visual element is unmounted here
  //     context.visualElement?.unmount();
  //   };
  // });
</script>

{#if MeasureLayout && context.visualElement}
  <MeasureLayout visualElement={context.visualElement} {...configAndProps} />
{/if}
<Renderer
  {Component}
  {props}
  ref={useMotionRef(visualState, context.visualElement, externalRef)}
  {visualState}
  {isStatic}
/>
