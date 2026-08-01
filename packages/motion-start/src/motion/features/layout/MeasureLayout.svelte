<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
import type { LayoutGroupContext } from '../../../context/LayoutGroupContext.svelte.js';
import type { SwitchLayoutGroupContext } from '../../../context/SwitchLayoutGroupContext.js';
import type { VisualElement } from '../../../render/VisualElement.svelte.js';
import type { MotionProps } from '../../types.js';

interface MeasureContextProps {
	layoutGroup: LayoutGroupContext;
	switchLayoutGroup?: SwitchLayoutGroupContext;
	isPresent: boolean;
	safeToRemove?: VoidFunction | null;
	measurePop?: import('svelte/attachments').Attachment | null;
	/**
	 * A stable dependency contributed by an enclosing `AnimatePresence` or
	 * `Reorder` group's `layoutInvalidation` tokens. This is separate from
	 * `layoutDependency` because it is ambient: an element inherits it
	 * without opting in, so it must add snapshot opportunities rather than
	 * replace the user's own dependency.
	 */
	ambientLayoutDependency?: unknown;
}

export interface MeasureProps extends MotionProps, MeasureContextProps {
	visualElement: VisualElement<unknown>;
}

export const animateLayout = {
	track: <A extends unknown[], R>(fn: (...args: A) => R) => {
		return fn;
	},
};
</script>

<script lang="ts">
	import { usePresence } from '../../../components/AnimatePresence/use-presence.svelte.js';
	import { useLayoutGroupContext } from '../../../context/LayoutGroupContext.svelte.js';
	import { usePresenceContext } from '../../../context/PresenceContext.svelte.js';
	import { useReorderContext } from '../../../context/ReorderContext.js';
	import { useSwitchLayoutGroupContext } from '../../../context/SwitchLayoutGroupContext.js';
	import MeasureLayoutWithContext from './MeasureLayoutWithContext.svelte';

	interface MeasureLayoutProps extends MotionProps {
		visualElement: VisualElement<unknown>;
	}
	const props: MeasureLayoutProps = $props();

	const presence = $derived.by(usePresence());
	const isPresent = $derived(presence[0]);
	const safeToRemove = $derived(presence[1] ?? null);

	const presenceContext = usePresenceContext();
	const reorderContext = useReorderContext();

	// measurePop is set by PopChild when mode="popLayout".
	const presenceMeasurePop = $derived(presenceContext?.measurePop);
	const presenceLayoutDependency = $derived(presenceContext?.presenceLayoutInvalidation?.current);

	const reorderLayoutDependency = $derived(reorderContext?.layoutInvalidation?.current);

	// Both contexts can be active at once (a reordered list inside an
	// AnimatePresence), so combine their opaque tokens into a single tuple
	// rather than stringifying them — a fresh tuple is only produced when one
	// of the underlying tokens actually changes.
	const ambientLayoutDependency = $derived([reorderLayoutDependency, presenceLayoutDependency]);

	// custom can still serve as a local layout dependency when no explicit
	// layoutDependency is provided.
	const layoutGroup = $derived(
		useLayoutGroupContext() ?? { forceRender: () => {} },
	);
</script>

<MeasureLayoutWithContext
	{...props}
	layoutDependency={props.layoutDependency ?? props.custom}
	{ambientLayoutDependency}
	measurePop={presenceMeasurePop}
	{layoutGroup}
	switchLayoutGroup={useSwitchLayoutGroupContext() ?? undefined}
	{isPresent}
	{safeToRemove}
/>
