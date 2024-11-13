<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script context="module" module lang="ts">
  interface AnimatedStateOptions {
    initialState: ResolvedValues;
  }
  const createObject = () => ({});
  // const stateVisualElement = visualElement({
  //   build: () => {},
  //   // @ts-expect-error
  //   measureViewportBox: axisBox,
  //   resetTransform: () => {},
  //   restoreTransform: () => {},
  //   removeValueFromRenderState: () => {},
  //   render: () => {},
  //   scrapeMotionValuesFromProps: createObject,
  //   readValueFromInstance: (_state, key, options) => (options as any).initialState[key] || 0,
  //   makeTargetAnimatable: (element, _a) => {
  //     var {transition, transitionEnd, ...target} = _a;
  //     var origin = getOrigin(target as any, transition || {}, element);
  //     checkTargetForNewValues(element, target, origin);
  //     return Object.assign(
  //       { transition, transitionEnd },
  //       target
  //     );
  //   },
  // });
  class StateVisualElement extends VisualElement<
    ResolvedValues,
    {},
    AnimatedStateOptions
  > {
    type: "state";
    build() {}
    measureInstanceViewportBox = createBox;
    resetTransform() {}
    restoreTransform() {}
    removeValueFromRenderState() {}
    renderInstance() {}
    scrapeMotionValuesFromProps() {
      return createObject();
    }
    getBaseTargetFromProps() {
      return undefined;
    }

    readValueFromInstance(
      _state: ResolvedValues,
      key: string,
      options: AnimatedStateOptions,
    ) {
      return options.initialState[key] || 0;
    }

    sortInstanceNodePosition() {
      return 0;
    }
  }
</script>

<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { TargetAndTransition } from "../../types";
  import { afterUpdate, getContext, onMount } from "svelte";
  import { ScaleCorrectionParentContext } from "../../context/ScaleCorrectionProvider.svelte";
  import { UseVisualState } from "../../motion/utils/use-visual-state.js";
  import type {
    ResolvedValues,
    VisualElementOptions,
  } from "../../render/types";
  import { createBox } from "../../projection/geometry/models";
  import { VisualElement } from "../../render/VisualElement";
  import { animateVisualElement } from "../interfaces/visual-element";

  export let initialState: VisualElementOptions<any, any>;

  let animationState = initialState;

  $: element = new StateVisualElement(
    {
      props: {
        onUpdate: (v) => {
          // @ts-expect-error
          animationState = { ...v };
        },
      },
      // @ts-expect-error
      visualState: state,
      presenceContext: null,
    },
    // @ts-expect-error
    { initialState },
  );
  onMount(() => {
    element.mount({});
    return () => element.unmount();
  });
  const _afterUpdate = () => {
    // @ts-expect-error
    element.setProps({
      onUpdate: (v: VisualElementOptions<any, any>) =>
        (animationState = { ...v }),
    });
  };

  afterUpdate(_afterUpdate);
  const scaleCorrectionParentContext = getContext<Writable<Array<unknown>>>(
    ScaleCorrectionParentContext,
  );
  scaleCorrectionParentContext.update((v) =>
    v.concat([
      {
        afterU: _afterUpdate,
      },
    ]),
  );
  let startAnimation = (animationDefinition: TargetAndTransition) => {
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
  <slot {...[animationState, startAnimation]} />
</UseVisualState>
