<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" module>
function useDefaultMotionValue(value: any, defaultValue = 0) {
	return isMotionValue(value) ? value : useMotionValue(defaultValue);
}
</script>

<script lang="ts" generics="V">
	import type { SvelteHTMLElements } from "svelte/elements";

	import { type Component, onDestroy } from "svelte";
	import { useReorderContext } from "../../context/ReorderContext.js";
	import { motion } from "../../render/components/motion/proxy.js";
	import { useMotionValue } from "../../value/use-motion-value.svelte.js";

	import type { HTMLMotionProps } from "../../render/html/types.js";
	import { invariant } from "../../utils/errors.js";
	import type { Ref } from "../../utils/safe-react-types.js";
	import type { PropsWithChildren } from "../../utils/types.js";
	import { useTransform } from "../../value/use-transform.js";
	import { isMotionValue } from "../../value/utils/is-motion-value.js";

	type Props<V> = {
		/**
		 * A HTML element to render this component as. Defaults to `"li"`.
		 *
		 * @public
		 */
		as?: keyof SvelteHTMLElements;

		/**
		 * The value in the list that this component represents.
		 *
		 * @public
		 */
		value: V;

		/**
		 * A subset of layout options primarily used to disable layout="size"
		 *
		 * @public
		 * @default true
		 */
		layout?: true | "position";
	};

	let {
		as = "li" as const,
		children,
		style = {},
		value,
		onDrag,
		onDragEnd,
		layout = true,
		drag: dragProp,
		ref: externalRef = $bindable(),
		...props
	}: Props<V> &
		HTMLMotionProps<any> & {
			ref?: Ref<SvelteHTMLElements[typeof as]>;
		} & PropsWithChildren<{}> = $props();

	const component = $derived(as as keyof typeof motion);
	const ReorderItem = $derived(
		motion[component] as Component<
			PropsWithChildren<
				HTMLMotionProps<any> & {
					ref?: Ref<SvelteHTMLElements[typeof as]>;
				}
			>
		>,
	);

	const context = $derived(useReorderContext());
	function getInitialStyleValue(axis: "x" | "y") {
		return style?.[axis];
	}
	const point: Record<"x" | "y", ReturnType<typeof useDefaultMotionValue>> = {
		x: useDefaultMotionValue(getInitialStyleValue("x")),
		y: useDefaultMotionValue(getInitialStyleValue("y")),
	};

	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) =>
		latestX || latestY ? 1 : "unset",
	);

	const axis = $derived(context?.axis);
	const registerItem = $derived(context?.registerItem);
	const unregisterItem = $derived(context?.unregisterItem);
	const updateOrder = $derived(context?.updateOrder);

	onDestroy(() => unregisterItem?.(value));
</script>

<!--
	`layoutDependency` is deliberately not set here. The group's
	`layoutInvalidation` already reaches every item as an ambient dependency (see
	`MeasureLayout`), which adds snapshot opportunities without replacing the
	user's own dependency. Setting it as a prop here would land after `{...props}`
	and silently discard a `layoutDependency` the caller passed in — which a board
	that moves items between groups needs in order to animate.
-->
<ReorderItem
	drag={dragProp ?? axis}
	{...props}
	dragSnapToOrigin
	style={{
		...style,
		x: point.x,
		y: point.y,
		zIndex,
	}}
	onDrag={(event, gesturePoint) => {
		event.preventDefault();

		const { velocity } = gesturePoint as {
			velocity: Record<"x" | "y", number>;
		};
		if (axis && (axis === "x" || axis === "y")) {
			const axisKey = axis as "x" | "y";
			if (velocity[axisKey]) {
				updateOrder?.(value, point[axisKey].get(), velocity[axisKey]);
			}
		}
		onDrag && onDrag(event, gesturePoint);
	}}
	{onDragEnd}
	onLayoutMeasure={(measured) => {
		registerItem?.(value, measured);
	}}
	ref={externalRef}
	{layout}
	ignoreStrict
>
	{invariant(
		Boolean(context),
		"Reorder.Item must be a child of Reorder.Group",
	)}
	{@render children()}
</ReorderItem>
