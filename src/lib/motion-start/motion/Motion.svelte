<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" generics="TProps, Instance, RenderState">
  import { MotionConfigContext } from "../context/MotionConfigContext";
  import { useVisualElement } from "./utils/use-visual-element.svelte";
  import { useMotionRef } from "./utils/use-motion-ref.svelte";
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
  import MeasureLayoutComp from "./features/layout/MeasureLayout.svelte";

  type Props = {
    props: MotionComponentProps<TProps>;
    ref?: Ref<Instance>;
  };

  let {
    createVisualElement,
    useVisualState,
    useRender: Renderer,
    Component,
    props,
    ref: externalRef = $bindable(),
  }: Props &
    Omit<
      MotionComponentConfig<Instance, RenderState>,
      "preloadedFeatures"
    > = $props();

  /**
   * If we need to measure the element we load this functionality in a
   * separate class component in order to gain access to getSnapshotBeforeUpdate.
   */
  let MeasureLayout: undefined | typeof MeasureLayoutComp = $state();

  const configAndProps = $derived({
    ...props,
    ...useContext(MotionConfigContext).current,
    layoutId: useLayoutId(() => props),
  });

  // $inspect(props, configAndProps);

  // svelte-ignore state_referenced_locally: onpurpose - isStatic shouldn't change
  const { isStatic } = configAndProps;

  const context = useCreateMotionContext<Instance>(props);

  const visualState = useVisualState(props, isStatic);

  if (!isStatic && isBrowser) {
    // useStrictMode(configAndProps, preloadedFeatures);
    const layoutProjection = getProjectionFunctionality(() => configAndProps);

    MeasureLayout = layoutProjection.MeasureLayout;

    /**
     * Create a VisualElement for this component. A VisualElement provides a common
     * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
     * providing a way of rendering to these APIs outside of the React render loop
     * for more performant animations and interactions
     */
    const visualElement = useVisualElement<Instance, RenderState>(
      Component,
      () => visualState,
      () => configAndProps,
      createVisualElement,
      layoutProjection.ProjectionNode,
    );

    context.visualElement = visualElement;

    // TODO: is unmounting with context causing other tests motion visual elemnents to unmount??
    // MotionContext.update(() => {
    //   context.visualElement = visualElement;
    //   return context;
    // });
  }

  // $effect(() => () => {
  //   console.log("dismounting");
  //   context.visualElement?.unmount();
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
