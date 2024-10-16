/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValues, VisualElement, VisualElementConfig, VisualElementOptions } from './types';

/** 
based on framer-motion@4.1.1,
Copyright (c) 2018 Framer B.V.
*/
import sync, { cancelSync } from 'framesync';
import { pipe } from 'popmotion';
import { Presence, type SharedLayoutAnimationConfig } from '../components/AnimateSharedLayout/types.js';
import { eachAxis } from '../utils/each-axis.js';
import { applyBoxTransforms, removeBoxTransforms } from '../utils/geometry/delta-apply.js';
import { calcRelativeBox, updateBoxDelta } from '../utils/geometry/delta-calc.js';
import { axisBox } from '../utils/geometry/index.js';
import { type MotionValue, motionValue } from '../value/index.js';
import { isMotionValue } from '../value/utils/is-motion-value.js';
import { setCurrentViewportBox } from './dom/projection/relative-set.js';
import { buildLayoutProjectionTransform } from './html/utils/build-projection-transform.js';
import { variantPriorityOrder } from './utils/animation-state.js';
import { FlatTree } from './utils/flat-tree.js';
import { isDraggable } from './utils/is-draggable.js';
import { createLifecycles } from './utils/lifecycles.js';
import { updateMotionValuesFromProps } from './utils/motion-values.js';
import { updateLayoutDeltas } from './utils/projection.js';
import { createLayoutState, createProjectionState, type TargetProjection } from './utils/state.js';
import { checkIfControllingVariants, checkIfVariantNode, isVariantLabel } from './utils/variants.js';
import type { TargetAndTransition, Transition } from '../types';
import type { MotionProps } from '../motion';
import type { AxisBox2D, AxisKey } from '../types/geometry';

// TODO: make abstract class - future plans to match latest FramerMotion
var visualElement = function <Instance = any, MutableState = any, Options extends {} = {}>({
	treeType,
	build,
	getBaseTarget,
	makeTargetAnimatable,
	measureViewportBox,
	render: renderInstance,
	readValueFromInstance,
	resetTransform,
	restoreTransform,
	removeValueFromRenderState,
	sortNodePosition,
	scrapeMotionValuesFromProps,
}: VisualElementConfig<Instance, MutableState, Options>) {
	return function (
		{ parent, props, presenceId, blockInitialAnimation, visualState }: VisualElementOptions<Instance, any>,
		options?: Options
	) {
		if (options === void 0) {
			options = <Options>{};
		}
		var latestValues = visualState.latestValues,
			renderState = visualState.renderState;
		/**
		 * The instance of the render-specific node that will be hydrated by the
		 * exposed React ref. So for example, this visual element can host a
		 * HTMLElement, plain object, or Three.js object. The functions provided
		 * in VisualElementConfig allow us to interface with this instance.
		 */
		var instance: Instance | null;
		/**
		 * Manages the subscriptions for a visual element's lifecycle, for instance
		 * onRender and onViewportBoxUpdate.
		 */
		var lifecycles = createLifecycles();
		/**
		 *
		 */
		var projection = createProjectionState();
		/**
		 * A reference to the nearest projecting parent. This is either
		 * undefined if we haven't looked for the nearest projecting parent,
		 * false if there is no parent performing layout projection, or a reference
		 * to the projecting parent.
		 */
		var projectionParent: boolean | undefined;
		/**
		 * This is a reference to the visual state of the "lead" visual element.
		 * Usually, this will be this visual element. But if it shares a layoutId
		 * with other visual elements, only one of them will be designated lead by
		 * AnimateSharedLayout. All the other visual elements will take on the visual
		 * appearance of the lead while they crossfade to it.
		 */
		var leadProjection = projection;
		var leadLatestValues = latestValues;
		var unsubscribeFromLeadVisualElement: Function | null | undefined;
		/**
		 * The latest layout measurements and calculated projections. This
		 * is seperate from the target projection data in visualState as
		 * many visual elements might point to the same piece of visualState as
		 * a target, whereas they might each have different layouts and thus
		 * projection calculations needed to project into the same viewport box.
		 */
		var layoutState = createLayoutState();
		/**
		 *
		 */
		var crossfader: { isActive: () => any; getCrossfadeState: (arg0: VisualElement<Instance, any>) => any };
		/**
		 * Keep track of whether the viewport box has been updated since the
		 * last time the layout projection was re-calculated.
		 */
		var hasViewportBoxUpdated = false;
		/**
		 * A map of all motion values attached to this visual element. Motion
		 * values are source of truth for any given animated value. A motion
		 * value might be provided externally by the component via props.
		 */
		var values = new Map();
		/**
		 * A map of every subscription that binds the provided or generated
		 * motion values onChange listeners to this visual element.
		 */
		var valueSubscriptions = new Map();
		/**
		 * A reference to the previously-provided motion values as returned
		 * from scrapeMotionValuesFromProps. We use the keys in here to determine
		 * if any motion values need to be removed after props are updated.
		 */
		var prevMotionValues = {};
		/**
		 * x/y motion values that track the progress of initiated layout
		 * animations.
		 *
		 * TODO: Target for removal
		 */
		var projectionTargetProgress: { x: MotionValue<number>; y: MotionValue<number> };
		/**
		 * When values are removed from all animation props we need to search
		 * for a fallback value to animate to. These values are tracked in baseTarget.
		 */
		var baseTarget = Object.assign({}, latestValues);
		// Internal methods ========================
		/**
		 * On mount, this will be hydrated with a callback to disconnect
		 * this visual element from its parent on unmount.
		 */
		var removeFromVariantTree: (() => void) | null | undefined;
		/**
		 *
		 */
		function render() {
			if (!instance) return;
			if (element.isProjectionReady()) {
				/**
				 * Apply the latest user-set transforms to the targetBox to produce the targetBoxFinal.
				 * This is the final box that we will then project into by calculating a transform delta and
				 * applying it to the corrected box.
				 */
				applyBoxTransforms(leadProjection.targetFinal, leadProjection.target, leadLatestValues);
				/**
				 * Update the delta between the corrected box and the final target box, after
				 * user-set transforms are applied to it. This will be used by the renderer to
				 * create a transform style that will reproject the element from its actual layout
				 * into the desired bounding box.
				 */
				updateBoxDelta(layoutState.deltaFinal, layoutState.layoutCorrected, leadProjection.targetFinal, latestValues);
			}
			triggerBuild();
			renderInstance(instance, renderState);
		}
		function triggerBuild() {
			var valuesToRender = latestValues;
			if (crossfader && crossfader.isActive()) {
				var crossfadedValues = crossfader.getCrossfadeState(element);
				if (crossfadedValues) valuesToRender = crossfadedValues;
			}
			build(element, renderState, valuesToRender, leadProjection, layoutState, options as Options, props);
		}
		function update() {
			lifecycles.notifyUpdate(latestValues);
		}
		function updateLayoutProjection() {
			if (!element.isProjectionReady()) return;
			var delta = layoutState.delta,
				treeScale = layoutState.treeScale;
			var prevTreeScaleX = treeScale.x;
			var prevTreeScaleY = treeScale.y;
			var prevDeltaTransform = layoutState.deltaTransform;
			updateLayoutDeltas(layoutState, leadProjection, element.path, latestValues);
			hasViewportBoxUpdated && element.notifyViewportBoxUpdate(leadProjection.target, delta);
			hasViewportBoxUpdated = false;
			var deltaTransform = buildLayoutProjectionTransform(delta, treeScale);
			if (
				deltaTransform !== prevDeltaTransform ||
				// Also compare calculated treeScale, for values that rely on this only for scale correction
				prevTreeScaleX !== treeScale.x ||
				prevTreeScaleY !== treeScale.y
			) {
				element.scheduleRender();
			}
			layoutState.deltaTransform = deltaTransform;
		}
		function updateTreeLayoutProjection() {
			//@ts-ignore
			element.layoutTree.forEach(fireUpdateLayoutProjection);
		}
		/**
		 *
		 */
		function bindToMotionValue(
			key: string,
			value: { onChange: (arg0: (latestValue: any) => void) => any; onRenderRequest: (arg0: () => void) => any }
		) {
			var removeOnChange = value.onChange(function (latestValue: string | number) {
				latestValues[key] = latestValue;
				props.onUpdate && sync.update(update, false, true);
			});
			var removeOnRenderRequest = value.onRenderRequest(element.scheduleRender);
			valueSubscriptions.set(key, function () {
				removeOnChange();
				removeOnRenderRequest();
			});
		}
		/**
		 * Any motion values that are provided to the element when created
		 * aren't yet bound to the element, as this would technically be impure.
		 * However, we iterate through the motion values and set them to the
		 * initial values for this component.
		 *
		 * TODO: This is impure and we should look at changing this to run on mount.
		 * Doing so will break some tests but this isn't neccessarily a breaking change,
		 * more a reflection of the test.
		 */
		var initialMotionValues = scrapeMotionValuesFromProps(props);
		for (var key in initialMotionValues) {
			var value = initialMotionValues[key];
			if (latestValues[key] !== undefined && isMotionValue(value)) {
				value.set(latestValues[key], false);
			}
		}
		/**
		 * Determine what role this visual element should take in the variant tree.
		 */
		var isControllingVariants = checkIfControllingVariants(props);
		var isVariantNode = checkIfVariantNode(props);
		var element: VisualElement<Instance, any> = Object.assign(
			Object.assign(
				{
					treeType: treeType,
					/**
					 * This is a mirror of the internal instance prop, which keeps
					 * VisualElement type-compatible with React's RefObject.
					 */
					current: null,
					/**
					 * The depth of this visual element within the visual element tree.
					 */
					depth: parent ? parent.depth + 1 : 0,
					parent: parent,
					children: new Set(),
					/**
					 * An ancestor path back to the root visual element. This is used
					 * by layout projection to quickly recurse back up the tree.
					 */
					path: parent ? [...parent.path, ...[parent]] : [],
					layoutTree: parent ? parent.layoutTree : new FlatTree(),
					/**
					 *
					 */
					presenceId: presenceId,
					projection: projection,
					/**
					 * If this component is part of the variant tree, it should track
					 * any children that are also part of the tree. This is essentially
					 * a shadow tree to simplify logic around how to stagger over children.
					 */
					variantChildren: isVariantNode ? new Set() : undefined,
					/**
					 * Whether this instance is visible. This can be changed imperatively
					 * by AnimateSharedLayout, is analogous to CSS's visibility in that
					 * hidden elements should take up layout, and needs enacting by the configured
					 * render function.
					 */
					isVisible: undefined,
					/**
					 * Normally, if a component is controlled by a parent's variants, it can
					 * rely on that ancestor to trigger animations further down the tree.
					 * However, if a component is created after its parent is mounted, the parent
					 * won't trigger that mount animation so the child needs to.
					 *
					 * TODO: This might be better replaced with a method isParentMounted
					 */
					manuallyAnimateOnMount: Boolean(parent === null || parent === void 0 ? void 0 : parent.isMounted()),
					/**
					 * This can be set by AnimatePresence to force components that mount
					 * at the same time as it to mount as if they have initial={false} set.
					 */
					blockInitialAnimation: blockInitialAnimation,
					/**
					 * Determine whether this component has mounted yet. This is mostly used
					 * by variant children to determine whether they need to trigger their
					 * own animations on mount.
					 */
					isMounted: function () {
						return Boolean(instance);
					},
					mount: function (newInstance: Instance | null) {
						instance = element.current = newInstance;
						element.pointTo(element);
						if (isVariantNode && parent && !isControllingVariants) {
							removeFromVariantTree = parent === null || parent === void 0 ? void 0 : parent.addVariantChild(element);
						}
						parent === null || parent === void 0 ? void 0 : parent.children.add(element);
					},
					/**
					 *
					 */
					unmount: function () {
						cancelSync.update(update);
						cancelSync.render(render);
						cancelSync.preRender(element.updateLayoutProjection);
						valueSubscriptions.forEach(function (remove) {
							return remove();
						});
						element.stopLayoutAnimation();
						element.layoutTree.remove(element);
						removeFromVariantTree === null || removeFromVariantTree === void 0 ? void 0 : removeFromVariantTree();
						parent === null || parent === void 0 ? void 0 : parent.children.delete(element);
						unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0
							? void 0
							: unsubscribeFromLeadVisualElement();
						lifecycles.clearAllListeners();
					},
					/**
					 * Add a child visual element to our set of children.
					 */
					addVariantChild: function (child: VisualElement<any, any>) {
						var _a;
						var closestVariantNode = element.getClosestVariantNode();
						if (closestVariantNode) {
							(_a = closestVariantNode.variantChildren) === null || _a === void 0 ? void 0 : _a.add(child);
							return function () {
								return closestVariantNode?.variantChildren?.delete(child);
							};
						}
					},
					sortNodePosition: function (other: { treeType: string | undefined; getInstance: () => Instance }) {
						/**
						 * If these nodes aren't even of the same type we can't compare their depth.
						 */
						if (!sortNodePosition || treeType !== other.treeType) return 0;
						return sortNodePosition(element.getInstance() as Instance, other.getInstance());
					},
					/**
					 * Returns the closest variant node in the tree starting from
					 * this visual element.
					 */
					getClosestVariantNode: function () {
						return isVariantNode
							? element
							: parent === null || parent === void 0
								? void 0
								: parent.getClosestVariantNode();
					},
					/**
					 * A method that schedules an update to layout projections throughout
					 * the tree. We inherit from the parent so there's only ever one
					 * job scheduled on the next frame - that of the root visual element.
					 */
					scheduleUpdateLayoutProjection: parent
						? parent.scheduleUpdateLayoutProjection
						: function () {
								return sync.preRender(element.updateTreeLayoutProjection, false, true);
							},
					/**
					 * Expose the latest layoutId prop.
					 */
					getLayoutId: function () {
						return props.layoutId;
					},
					/**
					 * Returns the current instance.
					 */
					getInstance: function () {
						return instance;
					},
					/**
					 * Get/set the latest static values.
					 */
					getStaticValue: function (key: string | number) {
						return latestValues[key];
					},
					setStaticValue: function (key: string | number, value: string | number) {
						return (latestValues[key] = value);
					},
					/**
					 * Returns the latest motion value state. Currently only used to take
					 * a snapshot of the visual element - perhaps this can return the whole
					 * visual state
					 */
					getLatestValues: function () {
						return latestValues;
					},
					/**
					 * Set the visiblity of the visual element. If it's changed, schedule
					 * a render to reflect these changes.
					 */
					setVisibility: function (visibility: boolean | undefined) {
						if (element.isVisible === visibility) return;
						element.isVisible = visibility;
						element.scheduleRender();
					},
					/**
					 * Make a target animatable by Popmotion. For instance, if we're
					 * trying to animate width from 100px to 100vw we need to measure 100vw
					 * in pixels to determine what we really need to animate to. This is also
					 * pluggable to support Framer's custom value types like Color,
					 * and CSS variables.
					 */
					makeTargetAnimatable: function (target: TargetAndTransition, canMutate: boolean | undefined) {
						if (canMutate === void 0) {
							canMutate = true;
						}
						return makeTargetAnimatable(element, target, props, canMutate);
					},
					// Motion values ========================
					/**
					 * Add a motion value and bind it to this visual element.
					 */
					addValue: function (key: string, value: any) {
						// Remove existing value if it exists
						if (element.hasValue(key)) element.removeValue(key);
						values.set(key, value);
						latestValues[key] = value.get();
						bindToMotionValue(key, value);
					},
					/**
					 * Remove a motion value and unbind any active subscriptions.
					 */
					removeValue: function (key: string) {
						var _a;
						values.delete(key);
						(_a = valueSubscriptions.get(key)) === null || _a === void 0 ? void 0 : _a();
						valueSubscriptions.delete(key);
						delete latestValues[key];
						removeValueFromRenderState(key, renderState);
					},
					/**
					 * Check whether we have a motion value for this key
					 */
					hasValue: function (key: string) {
						return values.has(key);
					},
					/**
					 * Get a motion value for this key. If called with a default
					 * value, we'll create one if none exists.
					 */
					getValue: function (key: string, defaultValue: any) {
						var value = values.get(key);
						if (value === undefined && defaultValue !== undefined) {
							value = motionValue(defaultValue);
							element.addValue(key, value);
						}
						return value;
					},
					/**
					 * Iterate over our motion values.
					 */
					forEachValue: function (callback: (value: any, key: any, map: Map<any, any>) => void) {
						return values.forEach(callback);
					},
					/**
					 * If we're trying to animate to a previously unencountered value,
					 * we need to check for it in our state and as a last resort read it
					 * directly from the instance (which might have performance implications).
					 */
					readValue: function (key: string) {
						var _a;
						return (_a = latestValues[key]) !== null && _a !== void 0
							? _a
							: readValueFromInstance(instance as Instance, key, options);
					},
					/**
					 * Set the base target to later animate back to. This is currently
					 * only hydrated on creation and when we first read a value.
					 */
					setBaseTarget: function (key: string | number, value: any) {
						baseTarget[key] = value;
					},
					/**
					 * Find the base target for a value thats been removed from all animation
					 * props.
					 */
					getBaseTarget: function (key: string) {
						if (getBaseTarget) {
							var target = getBaseTarget(props, key);
							if (target !== undefined && !isMotionValue(target)) return target;
						}
						return baseTarget[key];
					},
				},
				lifecycles
			),
			{
				/**
				 * Build the renderer state based on the latest visual state.
				 */
				build: function () {
					triggerBuild();
					return renderState;
				},
				/**
				 * Schedule a render on the next animation frame.
				 */
				scheduleRender: function () {
					sync.render(render, false, true);
				},
				/**
				 * Synchronously fire render. It's prefered that we batch renders but
				 * in many circumstances, like layout measurement, we need to run this
				 * synchronously. However in those instances other measures should be taken
				 * to batch reads/writes.
				 */
				syncRender: render,
				/**
				 * Update the provided props. Ensure any newly-added motion values are
				 * added to our map, old ones removed, and listeners updated.
				 */
				setProps: function (newProps: MotionProps) {
					props = newProps;
					lifecycles.updatePropListeners(newProps);
					prevMotionValues = updateMotionValuesFromProps(element, scrapeMotionValuesFromProps(props), prevMotionValues);
				},
				getProps: function () {
					return props;
				},
				// Variants ==============================
				/**
				 * Returns the variant definition with a given name.
				 */
				getVariant: function (name: string | number) {
					var _a;
					return (_a = props.variants) === null || _a === void 0 ? void 0 : _a[name];
				},
				/**
				 * Returns the defined default transition on this component.
				 */
				getDefaultTransition: function () {
					return props.transition;
				},
				/**
				 * Used by child variant nodes to get the closest ancestor variant props.
				 */
				getVariantContext: function (startAtParent: boolean | undefined) {
					if (startAtParent === void 0) {
						startAtParent = false;
					}
					if (startAtParent) return parent === null || parent === void 0 ? void 0 : parent.getVariantContext();
					if (!isControllingVariants) {
						var context_1 = (parent === null || parent === void 0 ? void 0 : parent.getVariantContext()) || {};
						if (props.initial !== undefined) {
							//@ts-ignore
							context_1.initial = props.initial;
						}
						return context_1;
					}
					var context = {};
					for (var i = 0; i < numVariantProps; i++) {
						var name_1 = variantProps[i];
						//@ts-ignore
						var prop = props[name_1];
						if (isVariantLabel(prop) || prop === false) {
							//@ts-ignore
							context[name_1] = prop;
						}
					}
					return context;
				},
				// Layout projection ==============================
				/**
				 * Enable layout projection for this visual element. Won't actually
				 * occur until we also have hydrated layout measurements.
				 */
				enableLayoutProjection: function () {
					projection.isEnabled = true;
					element.layoutTree.add(element);
				},
				/**
				 * Lock the projection target, for instance when dragging, so
				 * nothing else can try and animate it.
				 */
				lockProjectionTarget: function () {
					projection.isTargetLocked = true;
				},
				unlockProjectionTarget: function () {
					element.stopLayoutAnimation();
					projection.isTargetLocked = false;
				},
				getLayoutState: function () {
					return layoutState;
				},
				setCrossfader: function (newCrossfader: any) {
					crossfader = newCrossfader;
				},
				isProjectionReady: function () {
					return projection.isEnabled && projection.isHydrated && layoutState.isHydrated;
				},
				/**
				 * Start a layout animation on a given axis.
				 */
				startLayoutAnimation: function (
					axis: AxisKey,
					transition: Transition | undefined,
					isRelative: boolean | undefined
				) {
					if (isRelative === void 0) {
						isRelative = false;
					}
					var progress = element.getProjectionAnimationProgress()[axis];
					var _a = isRelative ? projection.relativeTarget![axis] : projection.target[axis],
						min = _a.min,
						max = _a.max;
					var length = max - min;
					progress.clearListeners();
					progress.set(min);
					progress.set(min); // Set twice to hard-reset velocity
					progress.onChange(function (v: number) {
						element.setProjectionTargetAxis(axis, v, v + length, isRelative);
					});
					return element.animateMotionValue!(axis, progress, 0, transition);
				},
				/**
				 * Stop layout animations.
				 */
				stopLayoutAnimation: function () {
					eachAxis(function (axis) {
						return element.getProjectionAnimationProgress()[axis].stop();
					});
				},
				/**
				 * Measure the current viewport box with or without transforms.
				 * Only measures axis-aligned boxes, rotate and skew must be manually
				 * removed with a re-render to work.
				 */
				measureViewportBox: function (withTransform: boolean | undefined) {
					if (withTransform === void 0) {
						withTransform = true;
					}
					var viewportBox = measureViewportBox(instance as Instance, options);
					if (!withTransform) removeBoxTransforms(viewportBox, latestValues);
					return viewportBox;
				},
				/**
				 * Get the motion values tracking the layout animations on each
				 * axis. Lazy init if not already created.
				 */
				getProjectionAnimationProgress: function () {
					projectionTargetProgress ||
						(projectionTargetProgress = {
							x: motionValue(0),
							y: motionValue(0),
						});
					return projectionTargetProgress;
				},
				/**
				 * Update the projection of a single axis. Schedule an update to
				 * the tree layout projection.
				 */
				setProjectionTargetAxis: function (axis: AxisKey, min: any, max: any, isRelative: boolean | undefined) {
					if (isRelative === void 0) {
						isRelative = false;
					}
					var target; /*: {
                    min : number,
                    max : number,
                    projection: TargetProjection
                };*/
					if (isRelative) {
						if (!projection.relativeTarget) {
							projection.relativeTarget = axisBox();
						}
						target = projection.relativeTarget[axis];
					} else {
						projection.relativeTarget = undefined;
						target = projection.target[axis];
					}
					projection.isHydrated = true;
					target.min = min;
					target.max = max;
					// Flag that we want to fire the onViewportBoxUpdate event handler
					hasViewportBoxUpdated = true;
					lifecycles.notifySetAxisTarget();
				},
				/**
				 * Rebase the projection target on top of the provided viewport box
				 * or the measured layout. This ensures that non-animating elements
				 * don't fall out of sync differences in measurements vs projections
				 * after a page scroll or other relayout.
				 */
				rebaseProjectionTarget: function (force: any, box: AxisBox2D | undefined) {
					if (box === void 0) {
						box = layoutState.layout;
					}
					var _a = element.getProjectionAnimationProgress(),
						x = _a.x,
						y = _a.y;
					var shouldRebase =
						!projection.relativeTarget && !projection.isTargetLocked && !x.isAnimating() && !y.isAnimating();
					if (force || shouldRebase) {
						eachAxis(function (axis) {
							var _a = box[axis],
								min = _a.min,
								max = _a.max;
							element.setProjectionTargetAxis(axis, min, max);
						});
					}
				},
				/**
				 * Notify the visual element that its layout is up-to-date.
				 * Currently Animate.tsx uses this to check whether a layout animation
				 * needs to be performed.
				 */
				notifyLayoutReady: function (config: SharedLayoutAnimationConfig | undefined) {
					setCurrentViewportBox(element);
					element.notifyLayoutUpdate(layoutState.layout, element.prevViewportBox || layoutState.layout, config);
				},
				/**
				 * Temporarily reset the transform of the instance.
				 */
				resetTransform: function () {
					return resetTransform(element, instance as Instance, props);
				},
				restoreTransform: function () {
					return restoreTransform(instance as Instance, renderState);
				},
				updateLayoutProjection: updateLayoutProjection,
				updateTreeLayoutProjection: function () {
					//@ts-ignore
					element.layoutTree.forEach(fireResolveRelativeTargetBox);
					/**
					 * Schedule the projection updates at the end of the current preRender
					 * step. This will ensure that all layout trees will first resolve
					 * relative projection boxes into viewport boxes, and *then*
					 * update projections.
					 */
					sync.preRender(updateTreeLayoutProjection, false, true);
					// sync.postRender(() => element.scheduleUpdateLayoutProjection())
				},
				getProjectionParent: function () {
					if (projectionParent === undefined) {
						var foundParent = false;
						// Search backwards through the tree path
						for (var i = element.path.length - 1; i >= 0; i--) {
							var ancestor = element.path[i];
							if (ancestor.projection.isEnabled) {
								//@ts-ignore
								foundParent = ancestor;
								break;
							}
						}
						projectionParent = foundParent;
					}
					return projectionParent;
				},
				resolveRelativeTargetBox: function () {
					var relativeParent = element.getProjectionParent();
					if (!projection.relativeTarget || !relativeParent) return;
					calcRelativeBox(projection, relativeParent.projection);
					if (isDraggable(relativeParent)) {
						var target = projection.target;
						applyBoxTransforms(target, target, relativeParent.getLatestValues());
					}
				},
				shouldResetTransform: function () {
					return Boolean(props._layoutResetTransform);
				},
				/**
				 *
				 */
				pointTo: function (newLead: {
					projection: TargetProjection;
					getLatestValues: () => ResolvedValues;
					onSetAxisTarget: (arg0: () => void) => Function;
					onLayoutAnimationComplete: (arg0: () => void) => Function;
				}) {
					leadProjection = newLead.projection;
					leadLatestValues = newLead.getLatestValues();
					/**
					 * Subscribe to lead component's layout animations
					 */
					unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0
						? void 0
						: unsubscribeFromLeadVisualElement();
					unsubscribeFromLeadVisualElement = pipe(
						newLead.onSetAxisTarget(element.scheduleUpdateLayoutProjection),
						newLead.onLayoutAnimationComplete(function () {
							var _a;
							if (element.isPresent) {
								element.presence = Presence.Present;
							} else {
								(_a = element.layoutSafeToRemove) === null || _a === void 0 ? void 0 : _a.call(element);
							}
						})
					);
				},
				// TODO: Clean this up
				isPresent: true,
				presence: Presence.Entering,
			}
		);
		return element;
	};
};
function fireResolveRelativeTargetBox(child: { resolveRelativeTargetBox: () => void }) {
	child.resolveRelativeTargetBox();
}
function fireUpdateLayoutProjection(child: { updateLayoutProjection: () => void }) {
	child.updateLayoutProjection();
}
var variantProps = [...['initial'], ...variantPriorityOrder];
var numVariantProps = variantProps.length;

export { visualElement };
