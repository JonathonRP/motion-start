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
		onReorder: (newOrder: () => V[]) => void;

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
		Omit<HTMLMotionProps<any>, "values"> &
		PropsWithChildren<{}>;

	function getValue<V>(item: ItemData<V>) {
		return item.value;
	}

	function compareMin<V>(a: ItemData<V>, b: ItemData<V>) {
		return a.layout.min - b.layout.min;
	}
</script>

<script lang="ts" generics="V">
	import { invariant } from "../../utils/errors";
	import type { SvelteHTMLElements } from "svelte/elements";
	import { untrack, type Component, type Snippet } from "svelte";
	import { ReorderContext } from "../../context/ReorderContext";
	import { motion } from "../../render/components/motion/proxy";
	import type { HTMLMotionProps } from "../../render/html/types";
	import type { Ref } from "../../utils/safe-react-types";

	import type {
		ItemData,
		ReorderContext as ReorderContextProps,
	} from "./types";
	import { checkReorder } from "./utils/check-reorder.svelte";
	import type { PropsWithChildren } from "../../utils/types";
	import { useContext } from "../../context/use";

	let {
		children,
		as = "ul",
		axis = "y",
		onReorder,
		values,
		ref: externalRef = $bindable(),
		...props
	}: ReorderGroupProps<V> & {
		ref?: Ref<SvelteHTMLElements[typeof as]>;
	} = $props();

	const ReorderGroup = motion[as as keyof typeof motion] as Component<
		PropsWithChildren<
			HTMLMotionProps<any> & {
				ref?: Ref<SvelteHTMLElements[typeof as]>;
			},
			[(typeof values)[number]]
		>
	>;

	let order: ItemData<V>[] = [];
	let isReordering = $state({ current: false });

	invariant(Boolean(values), "Reorder.Group must be provided a values prop");

	let reorderContext = useContext(ReorderContext);
	const context: ReorderContextProps<V> = {
		axis,
		registerItem: (value, layout) => {
			// If the entry was already added, update it rather than adding it again
			const idx = order.findIndex((entry) => value === entry.value);
			if (idx !== -1) {
				order[idx].layout = layout[axis];
			} else {
				order.push({ value, layout: layout[axis] });
			}
			order.sort(compareMin);
		},
		updateOrder: (item, offset, velocity) => {
			console.log(isReordering.current);
			if (isReordering.current) return;

			const newOrder = checkReorder(() => order, item, offset, velocity);

			console.log(order !== newOrder);

			if (order !== newOrder) {
				isReordering.current = true;
				onReorder(() =>
					newOrder
						.map(getValue)
						.filter((value) => values.indexOf(value) !== -1),
				);
			}
		},
	};

	$effect(() => {
		isReordering.current;
		untrack(() => {
			isReordering.current = false;
		});
	});

	// $effect.pre(() => {
	// 	order = [];
	// });

	// $effect(() => {
	// 	untrack(() => {
	// 		ReorderContext.update(() => context);
	// 	});
	// 	// untrack(() => {
	// 	// 	useContext(ReorderContext).current = context;
	// 	// });
	// });
	// ReorderContext.update(() => context);
	// ReorderContext.Provider = context;
	reorderContext.current = context;
</script>

<ReorderGroup {...props} bind:ref={externalRef}>
	{@render children?.()}
</ReorderGroup>
