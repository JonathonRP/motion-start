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
  import { isSVGComponent } from "../render/dom/utils/is-svg-component";

  type Props = {
    props: MotionComponentProps<TProps>;
    externalRef?: Ref<Instance> | undefined;
    ref: Instance | null; // ref: SvelteHTMLElements[Parameters<RenderComponent<Instance, RenderState>>[1]['Component']]['this']
  };

  let {
    preloadedFeatures,
    createVisualElement,
    useVisualState,
    useRender: Render,
    Component: as,
    props,
    externalRef,
    ref = $bindable(null),
  }: Props & MotionComponentConfig<Instance, RenderState> = $props();

  const layoutId = $derived(useLayoutId(props));

  const configAndProps = $derived({
    ...useContext(MotionConfigContext),
    ...props,
    layoutId,
  });

  const { isStatic } = $derived(configAndProps);

  const context = useCreateMotionContext<Instance>(props);
  const visualState = useVisualState(props, isStatic);

  $effect(() => {
    useStrictMode(configAndProps, preloadedFeatures);
  });

  const layoutProjection = $derived(
    !isStatic && isBrowser
      ? getProjectionFunctionality(configAndProps)
      : undefined,
  );

  /**
   * If we need to measure the element we load this functionality in a
   * separate class component in order to gain access to getSnapshotBeforeUpdate.
   */
  const MeasureLayout = $derived(
    !isStatic && isBrowser ? layoutProjection?.MeasureLayout : undefined,
  );

  /**
   * Create a VisualElement for this component. A VisualElement provides a common
   * interface to renderer-specific APIs (ie DOM/Three.js etc) as well as
   * providing a way of rendering to these APIs outside of the React render loop
   * for more performant animations and interactions
   */
  context.visualElement = useVisualElement<Instance, RenderState>(
    as,
    () => visualState,
    () => configAndProps,
    createVisualElement,
    () => layoutProjection?.ProjectionNode,
  );

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
<Render Component={as} {props} {visualState} {isStatic}>
  {#snippet children({ elementProps })}
    <svelte:element
      this={as}
      {...elementProps}
      bind:this={() => ref,
      (v) => {
        ref = v;
        useMotionRef(visualState, context.visualElement, externalRef)(ref);
      }}
      xmlns={isSVGComponent(as) ? "http://www.w3.org/2000/svg" : undefined}
    >
      {@render props.children?.()}
    </svelte:element>
  {/snippet}
</Render>
