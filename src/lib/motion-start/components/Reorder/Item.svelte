<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes={true} />

<script lang="ts" module>
	function useDefaultMotionValue(value: any, defaultValue = 0) {
		return isMotionValue(value) ? value : useMotionValue(defaultValue);
	}
</script>

<script lang="ts" generics="V">
	import type { SvelteHTMLElements } from "svelte/elements";

	import { useContext } from "../../context/utils/context";
	import { ReorderContext } from "../../context/ReorderContext";
	import { motion } from "../../render/components/motion/proxy";
	import { useMotionValue } from "../../value/use-motion-value.svelte";
	import type { Snippet, Component } from "svelte";

	import { useTransform } from "../../value/use-transform";
	import { isMotionValue } from "../../value/utils/is-motion-value";
	import { invariant } from "../../utils/errors";
	import type { HTMLMotionProps } from "../../render/html/types";
	import type { Ref } from "../../utils/safe-react-types";
	import type { Box } from "../../projection/geometry/types";
	import type { PanInfo } from "../../gestures/pan/PanSession";

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
		children,
		style = {},
		value,
		as = "li",
		onDrag,
		layout = true,
		ref = $bindable(),
		...props
	}: Props<V> &
		Omit<HTMLMotionProps<any>, "children"> & {
			ref?: Ref<SvelteHTMLElements[typeof as]>;
		} & { children?: Snippet } = $props();

	motion.groupItem = motion[as as keyof typeof motion] as Component<
		Omit<HTMLMotionProps<any>, "children"> & {
			ref?: Ref<SvelteHTMLElements[typeof as]>;
		} & {
			children?: Snippet;
		}
	>;

	const context = $derived(useContext(ReorderContext).current);
	const point = $derived({
		x: useDefaultMotionValue(style?.x),
		y: useDefaultMotionValue(style?.y),
	});

	const zIndex = $derived(
		useTransform([point.x, point.y], ([latestX, latestY]) =>
			latestX || latestY ? 1 : "unset",
		),
	);

	$effect(() => {
		invariant(
			Boolean(context),
			"Reorder.Item must be a child of Reorder.Group",
		);
	});

	const { axis, registerItem, updateOrder } = $derived(context!);
</script>

<motion.groupItem
	drag={axis}
	{...props}
	dragSnapToOrigin
	style={{
		...style,
		...point,
		zIndex,
	}}
	{layout}
	onDrag={(event: PointerEvent, gesturePoint: PanInfo) => {
		event.stopPropagation();

		const { velocity } = gesturePoint;
		velocity[axis] && updateOrder(value, point[axis].get(), velocity[axis]);

		onDrag && onDrag(event, gesturePoint);
	}}
	onLayoutMeasure={(measured: Box) => registerItem(value, measured)}
	bind:ref
	ignoreStrict
>
	{@render children?.()}
</motion.groupItem>
