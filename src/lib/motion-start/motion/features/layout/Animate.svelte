<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
  const progressTarget = 1000;

  function hasMoved(a: AxisBox2D, b: AxisBox2D) {
    return (
      !isZeroBox(a) &&
      !isZeroBox(b) &&
      (!axisIsEqual(a.x, b.x) || !axisIsEqual(a.y, b.y))
    );
  }

  const zeroAxis = { min: 0, max: 0 } satisfies Axis;
  function isZeroBox(a: AxisBox2D) {
    return axisIsEqual(a.x, zeroAxis) && axisIsEqual(a.y, zeroAxis);
  }

  function axisIsEqual(a: Axis, b: Axis) {
    return a.min === b.min && a.max === b.max;
  }

  const defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1],
  };
</script>

<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    getValueTransition,
    startAnimation,
  } from "../../../animation/utils/transitions.js";
  import { defaultScaleCorrectors } from "../../../render/dom/projection/default-scale-correctors.js";
  import { addScaleCorrection } from "../../../render/dom/projection/scale-correction.js";
  import { eachAxis } from "../../../utils/each-axis.js";
  import { axisBox } from "../../../utils/geometry/index.js";
  import { tweenAxis } from "./utils";
  import type { Axis, AxisBox2D } from "../../../types/geometry.js";
  import type { VisualElement } from "../../../render/types.js";

  export let visualElement: VisualElement,
    //initial = undefined,
    //style = undefined,
    //transformTemplate = undefined,
    //transformValues = undefined,
    //AnimationProps
    //animate = undefined,
    //exit = undefined,
    //variants = undefined,
    //transition = undefined,
    //VisualElementLifecycles
    //onViewportBoxUpdate = undefined,
    //onBeforeLayoutMeasure = undefined,
    //onLayoutMeasure = undefined,
    //onUpdate = undefined,
    //onAnimationStart = undefined,
    //onAnimationComplete = undefined,
    //onLayoutAnimationComplete = undefined,
    //GestureHandlers
    // PanHandlers
    //onPan = undefined,
    //onPanStart = undefined,
    //onPanSessionStart = undefined,
    //onPanEnd = undefined,
    // TapHandlers
    //onTap = undefined,
    //onTapStart = undefined,
    //onTapCancel = undefined,
    //whileTap = undefined,
    //HoverHandlers
    //whileHover = undefined,
    //onHoverStart = undefined,
    //onHoverEnd = undefined,
    //FocusHandlers
    //whileFocus = undefined,
    //DraggableProps
    //drag = undefined,
    //whileDrag = undefined,
    //dragDirectionLock = undefined,
    //dragPropagation = undefined,
    //dragConstraints = undefined,
    //dragElastic = undefined,
    //dragMomentum = undefined,
    //dragTransition = undefined,
    //dragControls = undefined,
    //dragListener = undefined,
    //onMeasureDragConstraints = undefined,
    //_dragX = undefined,
    //_dragY = undefined,
    //DragHandlers
    //onDragStart = undefined,
    //onDragEnd = undefined,
    //onDrag = undefined,
    //onDirectionLock = undefined,
    //onDragTransitionEnd = undefined,
    // LayoutProps
    layout = undefined,
    //layoutId = undefined,
    //MotionAdvancedProps
    //custom = undefined,
    //inherit = undefined,
    safeToRemove;

  /**
   * A mutable object that tracks the target viewport box
   * for the current animation frame.
   */
  let frameTarget = axisBox();
  /**
   * The current animation target, we use this to check whether to start
   * a new animation or continue the existing one.
   */
  let currentAnimationTarget = axisBox();
  /**
   * Track whether we're animating this axis.
   */
  let isAnimating = {
    x: false,
    y: false,
  };
  let stopAxisAnimation = {
    x: undefined,
    y: undefined,
  } as any satisfies AxisBox2D;

  let isAnimatingTree = false;

  const animateF = (
    target: AxisBox2D,
    origin: AxisBox2D,
    {
      originBox,
      targetBox,
      visibilityAction,
      shouldStackAnimate,
      onComplete,
      ...config
    } = {} as any,
  ) => {
    /**
     * Early return if we've been instructed not to animate this render.
     */
    if (shouldStackAnimate === false) {
      isAnimatingTree = false;
      return safeToRemove();
    }

    /**
     * Prioritise tree animations
     */
    if (isAnimatingTree && shouldStackAnimate !== true) {
      return;
    } else if (shouldStackAnimate) {
      isAnimatingTree = true;
    }

    /**
     * Allow the measured origin (prev bounding box) and target (actual layout) to be
     * overridden by the provided config.
     */
    origin = originBox || origin;
    target = targetBox || target;

    const boxHasMoved = hasMoved(origin, target);

    const animations = eachAxis((axis) => {
      /**
       * If layout is set to "position", we can resize the origin box based on the target
       * box and only animate its position.
       */
      if (layout === "position") {
        const targetLength = target[axis].max - target[axis].min;
        origin[axis].max = origin[axis].min + targetLength;
      }

      if (visualElement.projection.isTargetLocked) {
        return;
      } else if (visibilityAction !== undefined) {
        visualElement.setVisibility(visibilityAction === visibilityAction.Show);
      } else if (boxHasMoved) {
        // If the box has moved, animate between it's current visual state and its
        // final state
        return animateAxis(axis, target[axis], origin[axis], config);
      } else {
        // If the box has remained in the same place, immediately set the axis target
        // to the final desired state
        return visualElement.setProjectionTargetAxis(
          axis,
          target[axis].min,
          target[axis].max,
        );
      }
    });

    // Force a render to ensure there's no flash of uncorrected bounding box.
    visualElement.syncRender();

    /**
     * If this visualElement isn't present (ie it's been removed from the tree by the user but
     * kept in by the tree by AnimatePresence) then call safeToRemove when all axis animations
     * have successfully finished.
     */
    return Promise.all(animations).then(() => {
      isAnimatingTree = false;
      onComplete && onComplete();
      visualElement.notifyLayoutAnimationComplete();
    });
  };

  /**
   * TODO: This manually performs animations on the visualElement's layout progress
   * values. It'd be preferable to amend the startLayoutAxisAnimation
   * API to accept more custom animations like
   */
  const animateAxis = (
    axis: "x" | "y",
    target: Axis,
    origin: Axis,
    { transition: _transition } = {} as any,
  ) => {
    stopAxisAnimation[axis]?.();
    /**
     * If we're not animating to a new target, don't run this animation
     */
    if (
      (isAnimating as any)[axis] &&
      axisIsEqual(target, (currentAnimationTarget as any)[axis])
    ) {
      return;
    }

    stopAxisAnimation[axis]?.();
    (isAnimating as any)[axis] = true;

    const _frameTarget = (frameTarget as any)[axis];
    const layoutProgress = visualElement.getProjectionAnimationProgress()[axis];

    /**
     * Set layout progress back to 0. We set it twice to hard-reset any velocity that might
     * be re-incoporated into a subsequent spring animation.
     */
    layoutProgress.clearListeners();
    layoutProgress.set(0);
    layoutProgress.set(0);

    /**
     * Create an animation function to run once per frame. This will tween the visual bounding box from
     * origin to target using the latest progress value.
     */
    const frame = () => {
      // Convert the latest layoutProgress, which is a value from 0-1000, into a 0-1 progress
      const p = layoutProgress.get() / progressTarget;

      // Tween the axis and update the visualElement with the latest values
      tweenAxis(_frameTarget, origin, target, p);
      visualElement.setProjectionTargetAxis(
        axis,
        _frameTarget.min,
        _frameTarget.max,
      );
    };

    // Synchronously run a frame to ensure there's no flash of the uncorrected bounding box.
    frame();

    // Ensure that the layout delta is updated for this frame.
    //visualElement.updateLayoutProjection();

    // Create a function to stop animation on this specific axis
    const unsubscribeProgress = layoutProgress.onChange(frame);

    stopAxisAnimation[axis] = () => {
      (isAnimating as any)[axis] = false;
      layoutProgress.stop();
      unsubscribeProgress();
    };

    (currentAnimationTarget as any)[axis] = target;

    const layoutTransition =
      _transition ||
      visualElement.getDefaultTransition() ||
      defaultLayoutTransition;

    // Start the animation on this axis
    const animation = startAnimation(
      axis === "x" ? "layoutX" : "layoutY",
      layoutProgress,
      progressTarget,
      layoutTransition && getValueTransition(layoutTransition, "layout"),
    ).then(stopAxisAnimation[axis]);

    return animation;
  };

  const subLayoutReady = () => {
    visualElement.animateMotionValue = startAnimation;
    visualElement.enableLayoutProjection();
    const unsubLayoutReady = visualElement.onLayoutUpdate(animateF);
    visualElement.layoutSafeToRemove = function () {
      safeToRemove();
    };

    addScaleCorrection(defaultScaleCorrectors);

    return () => {
      unsubLayoutReady();
      eachAxis((axis) => stopAxisAnimation[axis]?.());
    };
  };

  onMount(subLayoutReady);
  // beforeUpdate(subLayoutReady);

  // afterUpdate(subLayoutReady);
</script>
