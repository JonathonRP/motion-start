<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" module>
	function useDefaultMotionValue(value: any, defaultValue = 0) {
		return isMotionValue(value) ? value : useMotionValue(defaultValue);
	}
</script>

<script lang="ts" generics="V">
	import type { SvelteHTMLElements } from "svelte/elements";

	import { type Component } from "svelte";
	import { useReorderContext } from "../../context/ReorderContext";
	import { motion } from "../../render/components/motion/proxy";
	import { useMotionValue } from "../../value/use-motion-value.svelte";

	import type { animateLayout } from "../../motion/features/layout/MeasureLayout.svelte";
	import type { HTMLMotionProps } from "../../render/html/types";
	import { invariant } from "../../utils/errors";
	import type { Ref } from "../../utils/safe-react-types";
	import type { PropsWithChildren } from "../../utils/types";
	import { useTransform } from "../../value/use-transform";
	import { isMotionValue } from "../../value/utils/is-motion-value";

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
		layout?:
			| ReturnType<(typeof animateLayout)["track"]>
			| true
			| "position";
	};

	let {
		as = "li",
		children,
		style = {},
		value,
		onDrag,
		layout = true,
		ref: externalRef = $bindable(),
		...props
	}: Props<V> &
		HTMLMotionProps<any> & {
			ref?: Ref<SvelteHTMLElements[typeof as]>;
		} & PropsWithChildren<{}> = $props();

	const ReorderItem = motion[as as keyof typeof motion] as Component<
		PropsWithChildren<
			HTMLMotionProps<any> & {
				ref?: Ref<SvelteHTMLElements[typeof as]>;
			}
		>
	>;

	const context = $derived(useReorderContext());
	const point: Record<"x" | "y", ReturnType<typeof useDefaultMotionValue>> = {
		x: useDefaultMotionValue(style?.x),
		y: useDefaultMotionValue(style?.y),
	};

	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) =>
		latestX || latestY ? 1 : "unset",
	);

	// Access context properties directly to preserve getter reactivity
	const axis = $derived(context?.axis);
	const registerItem = $derived(context?.registerItem);
	const updateOrder = $derived(context?.updateOrder);
</script>

<ReorderItem
	drag={axis}
	{...props}
	dragSnapToOrigin
	style={{
		...style,
		x: point.x,
		y: point.y,
		zIndex,
	}}
	onDrag={async (event, gesturePoint) => {
		event.preventDefault();

		const { velocity } = gesturePoint as {
			velocity: Record<"x" | "y", number>;
		};
		if (axis && (axis === "x" || axis === "y")) {
			// Type narrowed to 'x' | 'y'
			const axisKey = axis as "x" | "y";
			if (velocity[axisKey]) {
				const mv = point[axisKey];
				updateOrder?.(value, mv.get(), velocity[axisKey]);
			}
		}
		onDrag && onDrag(event, gesturePoint);
	}}
	onLayoutMeasure={(measured) => registerItem?.(value, measured)}
	bind:ref={externalRef}
	{layout}
	custom={value}
	ignoreStrict
>
	{invariant(
		Boolean(context),
		"Reorder.Item must be a child of Reorder.Group",
	)}
	{@render children()}
</ReorderItem>
