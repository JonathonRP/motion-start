<svelte:options runes={true} />

<script lang="ts" generics="V">
	import type { SvelteHTMLElements } from "svelte/elements";
	import type { ReorderContextProps } from "./types";
	import type { DefaultPropsType } from ".";

	import Motion from "../../motion/Motion.svelte";
	import { useMotionValue } from "../../value/use-motion-value";
	import { getContext } from "svelte";

	import { useTransform } from "../../value/use-transform";
	import { isMotionValue } from "../../value/utils/is-motion-value";
	import { invariant } from "../../utils/errors";

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

	const {
		children,
		style = {},
		value,
		as = "li",
		onDrag,
		layout = true,
		...props
	}: Props<V> & DefaultPropsType = $props();

	const context = getContext<ReorderContextProps<V>>("Reorder");
	const point = $state({
		x: useDefaultMotionValue(style?.x),
		y: useDefaultMotionValue(style?.y),
	});

	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) =>
		latestX || latestY ? 1 : "unset",
	);

	invariant(
		Boolean(context),
		"Reorder.Item must be a child of Reorder.Group",
	);

	const { axis, registerItem, updateOrder } = $derived(context);

	function useDefaultMotionValue(value: any, defaultValue = 0) {
		return isMotionValue(value) ? value : useMotionValue(defaultValue);
	}
</script>

<Motion
	drag={axis}
	{...props}
	style={{
		...style,
		x: point.x,
		y: point.y,
		zIndex,
	}}
	{layout}
	onDrag={(event, gesturePoint) => {
		event.stopPropagation();

		const { velocity } = gesturePoint;
		velocity[axis] && updateOrder(value, point[axis].get(), velocity[axis]);

		onDrag && onDrag(event, gesturePoint);
	}}
	onLayoutMeasure={(measured) => registerItem(value, measured)}
	dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
	dragElastic={0.88}
	_dragX={point.x}
	_dragY={point.y}
	whileDrag={{
		scale: 1.025,
	}}
	dragTransition={{
		bounceDamping: 15,
		bounceStiffness: 200,
		min: 0,
		max: 50,
		power: 0.88,
	}}
	let:motion
>
	<svelte:element this={as} class={props.class} use:motion>
		{@render children()}
	</svelte:element>
</Motion>
