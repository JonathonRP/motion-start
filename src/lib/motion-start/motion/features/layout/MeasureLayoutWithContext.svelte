<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
	import { watch } from "runed";
	import { onDestroy, onMount, tick } from "svelte";
	import { frame } from "../../../frameloop";
	import { microtask } from "../../../frameloop/microtask";
	import { globalProjectionState } from "../../../projection/node/state";
	import { correctBorderRadius } from "../../../projection/styles/scale-border-radius";
	import { correctBoxShadow } from "../../../projection/styles/scale-box-shadow";
	import { addScaleCorrector } from "../../../projection/styles/scale-correction";
	import type { MeasureProps } from "./MeasureLayout.svelte";

	const defaultScaleCorrectors = {
		borderRadius: {
			...correctBorderRadius,
			applyTo: [
				"borderTopLeftRadius",
				"borderTopRightRadius",
				"borderBottomLeftRadius",
				"borderBottomRightRadius",
			],
		},
		borderTopLeftRadius: correctBorderRadius,
		borderTopRightRadius: correctBorderRadius,
		borderBottomLeftRadius: correctBorderRadius,
		borderBottomRightRadius: correctBorderRadius,
		boxShadow: correctBoxShadow,
	};

	const props: MeasureProps = $props();
	const safeToRemove = () => props.safeToRemove?.();

	const getDebugBox = (element: HTMLElement | SVGElement | undefined) => {
		if (!element || !("getBoundingClientRect" in element)) return null;
		const box = element.getBoundingClientRect();
		return {
			top: box.top,
			left: box.left,
			width: box.width,
			height: box.height,
		};
	};

	const getDebugLabel = (element: HTMLElement | SVGElement | undefined) => {
		if (!element) return null;
		const text =
			"textContent" in element
				? element.textContent?.replace(/\s+/g, " ").trim()
				: undefined;
		if (text) return text.slice(0, 80);
		const id = "id" in element ? element.id : undefined;
		const testId =
			"getAttribute" in element
				? element.getAttribute("data-testid")
				: undefined;
		const motionId =
			"getAttribute" in element
				? element.getAttribute("data-motion-debug")
				: undefined;
		const cls =
			"className" in element && typeof element.className === "string"
				? element.className
				: undefined;
		return motionId || testId || id || cls || element.tagName;
	};

	onMount(() => {
		const { visualElement, layoutGroup, switchLayoutGroup, layoutId } =
			props;
		const { projection } = visualElement;

		addScaleCorrector(defaultScaleCorrectors);

		if (projection) {
			if (layoutGroup.group) layoutGroup.group.add(projection);

			if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
				switchLayoutGroup.register(projection);
			}

			projection.root!.didUpdate();
			projection.addEventListener("animationComplete", () => {
				safeToRemove();
			});
			projection.setOptions({
				...projection.options,
				onExitComplete: () => safeToRemove(),
			});
		}

		globalProjectionState.hasEverUpdated = true;
	});

	// Incremented only when we actually snapshot so the post-commit didUpdate
	// pass stays paired with a real willUpdate transaction.
	let commitVersion = $state(0);

	// Pre-commit snapshot phase. This is the Svelte analogue of
	// getSnapshotBeforeUpdate in framer-motion's MeasureLayout.
	watch.pre(
		[
			() => props.layoutDependency,
			() => props.drag,
			() => props.visualElement?.projection,
			() => props.isPresent,
		],
		([], [prevLayoutDependency, , , prevIsPresent]) => {
			const { layoutDependency, visualElement, isPresent, measurePop } =
				props;
			const projection = visualElement?.projection;
			const element = visualElement.current as
				| HTMLElement
				| SVGElement
				| undefined;
			const shouldSnapshot =
				props.drag ||
				prevLayoutDependency !== layoutDependency ||
				layoutDependency === undefined;

			if (layoutDependency !== undefined || props.layout) {
				const box = getDebugBox(element);
				console.log(
					`[MeasureLayoutWithContext] dep-pre label=${getDebugLabel(element)} layoutDependency=${layoutDependency} prevLayoutDependency=${prevLayoutDependency} isPresent=${isPresent} prevIsPresent=${prevIsPresent} boxTop=${box?.top} boxLeft=${box?.left} boxWidth=${box?.width} boxHeight=${box?.height}`,
				);
			}

			if (!projection) {
				if (prevIsPresent !== isPresent && !isPresent) {
					safeToRemove();
				}
				prevIsPresent = isPresent;
				return;
			}

			projection.isPresent = isPresent;

			if (shouldSnapshot) {
				const box = getDebugBox(element);
				console.log(
					`[MeasureLayoutWithContext] before-willUpdate label=${getDebugLabel(element)} layoutDependency=${layoutDependency} prevLayoutDependency=${prevLayoutDependency} isPresent=${isPresent} boxTop=${box?.top} boxLeft=${box?.left} boxWidth=${box?.width} boxHeight=${box?.height}`,
				);
				projection.willUpdate();
				commitVersion++;
			} else if (prevIsPresent === isPresent) {
				safeToRemove();
			}

			if (prevIsPresent !== isPresent) {
				if (isPresent) {
					projection.promote();
				} else {
					if (!projection.relegate()) {
						frame.postRender(() => {
							const stack = projection.getStack();
							if (!stack || !stack.members.length) {
								safeToRemove();
							}
						});
					}
				}
			}
		},
	);

	// Post-commit projection flush. Runs after a snapshot-triggering pre-pass so
	// projection.root.didUpdate() sees the committed DOM.
	watch([() => commitVersion, () => props.visualElement?.projection], () => {
		const { measurePop } = props;
		const { visualElement } = props;

		tick().then(() => {
			if (!commitVersion || !visualElement?.projection) return;

			const { projection } = visualElement;
			const element = visualElement.current as
				| HTMLElement
				| SVGElement
				| undefined;
			const box = getDebugBox(element);
			console.log(
				`[MeasureLayoutWithContext] before-didUpdate label=${getDebugLabel(element)} layoutDependency=${props.layoutDependency} isPresent=${props.isPresent} boxTop=${box?.top} boxLeft=${box?.left} boxWidth=${box?.width} boxHeight=${box?.height}`,
			);
			if (measurePop) {
				measurePop(visualElement.current as HTMLElement | SVGElement);
			}
			projection.root!.didUpdate();
			microtask.postRender(() => {
				const nextElement = props.visualElement.current as
					| HTMLElement
					| SVGElement
					| undefined;
				const nextBox = getDebugBox(nextElement);
				console.log(
					`[MeasureLayoutWithContext] after-didUpdate label=${getDebugLabel(nextElement)} layoutDependency=${props.layoutDependency} isPresent=${props.isPresent} boxTop=${nextBox?.top} boxLeft=${nextBox?.left} boxWidth=${nextBox?.width} boxHeight=${nextBox?.height}`,
				);
				if (!projection.currentAnimation && projection.isLead()) {
					safeToRemove();
				}
			});
		});
	});

	onDestroy(() => {
		const { visualElement, layoutGroup, switchLayoutGroup } = props;
		if (visualElement?.projection) {
			const { projection } = visualElement;
			projection.scheduleCheckAfterUnmount();
			if (layoutGroup && layoutGroup.group)
				layoutGroup.group.remove(projection);
			if (switchLayoutGroup && switchLayoutGroup.deregister)
				switchLayoutGroup.deregister(projection);
		}
	});
</script>
