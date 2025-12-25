<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script module lang="ts">
  var createObject = () => ({});
  var stateVisualElement = visualElement({
    build: () => {},
    // @ts-expect-error
    measureViewportBox: axisBox,
    resetTransform: () => {},
    restoreTransform: () => {},
    removeValueFromRenderState: () => {},
    render: () => {},
    scrapeMotionValuesFromProps: createObject,
    readValueFromInstance: (_state, key, options) => (options as any).initialState[key] || 0,
    makeTargetAnimatable: (element, _a) => {
      var {transition, transitionEnd, ...target} = _a;
      var origin = getOrigin(target as any, transition || {}, element);
      checkTargetForNewValues(element, target, origin);
      return Object.assign(
        { transition, transitionEnd },
        target
      );
    },
  });
</script>

<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext } from "svelte";
  import { ScaleCorrectionParentContext } from "../context/ScaleCorrectionProvider.svelte";
  import { UseVisualState } from "../motion/utils/use-visual-state.js";
  import { visualElement } from "../render/index.js";
  import { animateVisualElement, type AnimationDefinition } from "../render/utils/animation";
  import {
    checkTargetForNewValues,
    getOrigin,
  } from "../render/utils/setters.js";
    import type { VisualElementOptions } from "../render/types";

  let { initialState }: { initialState: VisualElementOptions<any, any> } = $props();

  let animationState = $state(initialState);
  const sve = stateVisualElement;

  let element = $state<any>(undefined);

  const createElement = (state: any) => {
    if (state) {
      // @ts-expect-error
      element = sve({ props: {}, visualState: state });
    }
  };

  $effect(() => {
    if (element) {
      // @ts-expect-error
      element.mount({});
      return () => {
        // @ts-expect-error
        element.unmount();
      };
    }
  });

  const _afterUpdate = () => {
    if (element) {
      // @ts-expect-error
      element.setProps({
        onUpdate: (v: VisualElementOptions<any, any>) => (animationState = { ...v }),
      });
    }
  };

  $effect(() => {
    _afterUpdate();
  });

  const scaleCorrectionParentContext = getContext<Writable<Array<unknown>>>(
    ScaleCorrectionParentContext
  );
  scaleCorrectionParentContext.update((v) =>
    v.concat([
      {
        afterU: _afterUpdate,
      },
    ])
  );

  let startAnimation = (animationDefinition: AnimationDefinition) => {
    // @ts-expect-error
    return animateVisualElement(element, animationDefinition);
  };
</script>

<UseVisualState
  config={{
    scrapeMotionValuesFromProps: createObject,
    createRenderState: createObject,
  }}
  props={{}}
  isStatic={false}
  let:state
>
  {#if createElement(state)}
  {/if}
  <slot animatedState={[animationState, startAnimation]} />
</UseVisualState>
