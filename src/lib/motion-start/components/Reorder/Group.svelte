<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" module>
	export interface Props<V> {
		/**
		 * A HTML element to render this component as. Defaults to `"ul"`.
		 *
		 * @public
		 */
		as?: keyof SvelteHTMLElements;

		/**
		 * The axis to reorder along. By default, items will be draggable on this axis.
		 * To make draggable on both axes, set `<Reorder.Item drag />`
		 *
		 * @public
		 */
		axis?: "x" | "y";

		/**
		 * A callback to fire with the new value order. For instance, if the values
		 * are provided as a state from `useState`, this could be the set state function.
		 *
		 * @public
		 */
		onReorder?: (newOrder: V[]) => void;

		/**
		 * The latest values state.
		 *
		 * ```jsx
		 * function Component() {
		 *   const [items, setItems] = useState([0, 1, 2])
		 *
		 *   return (
		 *     <Reorder.Group values={items} onReorder={setItems}>
		 *         {items.map((item) => <Reorder.Item key={item} value={item} />)}
		 *     </Reorder.Group>
		 *   )
		 * }
		 * ```
		 *
		 * @public
		 */
		values: V[];
	}

	type ReorderGroupProps<V> = Props<V> &
		Omit<HTMLMotionProps<any>, "values" | "children">;

	function getValue<V>(item: ItemData<V>) {
		return item.value;
	}

	function compareMin<V>(a: ItemData<V>, b: ItemData<V>) {
		return a.layout.min - b.layout.min;
	}
</script>

<script lang="ts" generics="V">
	import { type Component, type Snippet, untrack } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";
	import { setReorderContext } from "../../context/ReorderContext";
	import { useLayoutGroupContext, setLayoutGroupContext } from "../../context/LayoutGroupContext.svelte";
	import { motion } from "../../render/components/motion/proxy";
	import type { HTMLMotionProps } from "../../render/html/types";
	import { invariant } from "../../utils/errors";
	import { nodeGroup } from "../../projection/node/group";
	import type { Ref } from "../../utils/safe-react-types";

	import type { PropsWithChildren } from "../../utils/types";
	import { type ReorderContext, type ItemData } from "./types";
	import { checkReorder } from "./utils/check-reorder.svelte";

	let {
		as = "ul",
		axis: axisProp = $bindable("y"),
		values,
		onReorder,
		ref: externalRef = $bindable(),
		children,
		...props
	}: ReorderGroupProps<V> & {
		ref?: Ref<SvelteHTMLElements[typeof as]>;
		children: Snippet<[{ item: V; id: number }]>;
	} = $props();

	const axis = $derived(axisProp);

	const ReorderGroup = motion[as as keyof typeof motion] as Component<
		PropsWithChildren<
			HTMLMotionProps<any> & {
				ref?: Ref<SvelteHTMLElements[typeof as]>;
			},
			[(typeof values)[number]]
		>
	>;

	// Create an implicit nodeGroup so item projections are registered together.
	// This lets updateOrder call group.dirty() to synchronously snapshot all item
	// positions before the DOM reorder — the same pattern AnimatePresence uses.
	const parentLayoutContext = useLayoutGroupContext();
	const group = nodeGroup();
	setLayoutGroupContext({ ...parentLayoutContext, group });

	let order: ItemData<V>[] = [];
	let orderVersion = $state(0);

	const context = $state<ReorderContext<V>>({
		get axis() {
			return axis;
		},
		get orderVersion() {
			return orderVersion;
		},
		registerItem: (value, layout) => {
			const idx = order.findIndex((entry) => value === entry.value);
			if (idx !== -1) {
				order[idx].layout = layout[axis];
			} else {
				order.push({ value, layout: layout[axis] });
			}
			order.sort(compareMin);
		},
		updateOrder: (item, offset, velocity) => {
			const newOrder = checkReorder(order, item, offset, velocity);
			if (order !== newOrder) {
				// Snapshot all item positions synchronously before the DOM reorder.
				// group.dirty() calls willUpdate() on every registered projection node,
				// giving FLIP the pre-move positions to animate from.
				group.dirty();
				order = newOrder;
				// Bump orderVersion so MeasureLayoutWithContext's watch (post-effect)
				// calls didUpdate() after Svelte commits the DOM reorder.
				untrack(() => orderVersion++);
				onReorder?.(
					newOrder
						.map(getValue)
						.filter((value) => values.includes(value)),
				);
			}
		},
	});
	setReorderContext(context);
</script>

<ReorderGroup {...props} bind:ref={externalRef} ignoreStrict>
	{invariant(Boolean(values), "Reorder.Group must be provided a values prop")}
	{#each values as item, indx (item)}
		{@render children({ item, id: indx })}
	{/each}
</ReorderGroup>
