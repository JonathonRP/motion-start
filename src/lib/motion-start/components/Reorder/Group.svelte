<svelte:options runes={true} />

<script lang="ts" generics="V">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { setContext } from 'svelte';
	import Motion from '../../render/components/motion/Motion.svelte';
	import type { DefaultPropsType } from '.';
	import type { ItemData, ReorderContextProps } from './types';

	import { invariant } from '../../utils/errors';
	import { checkReorder } from './utils/check-reorder';

	type Props<V> = {
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
		axis?: 'x' | 'y';

		/**
		 * A callback to fire with the new value order. For instance, if the values
		 * are provided as a state from `useState`, this could be the set state function.
		 *
		 * @public
		 */
		onReorder: (newOrder: V[]) => void;

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
	};

	const {
		children,
		as = 'ul',
		axis = 'y',
		onReorder,
		values,
		...props
	}: Props<V> & DefaultPropsType = $props();

	const order: ItemData<V>[] = [];
	let isReordering = $state(false);

	invariant(Boolean(values), 'Reorder.Group must be provided a values prop');

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
			if (isReordering) return;

			const newOrder = checkReorder(order, item, offset, velocity);

			if (order !== newOrder) {
				isReordering = true;
				onReorder(newOrder.map(getValue).filter((value) => values.indexOf(value) !== -1));
			}
		},
	};

	setContext<typeof context>('Reorder', context);

	$effect(() => {
		if (!isReordering) return;
		isReordering = false;
	});

	function getValue<V>(item: ItemData<V>) {
		return item.value;
	}

	function compareMin<V>(a: ItemData<V>, b: ItemData<V>) {
		return a.layout.min - b.layout.min;
	}
</script>

<Motion {...props} let:motion>
	<svelte:element this={as} class={props.class} use:motion>
		{@render children()}
	</svelte:element>
</Motion>
