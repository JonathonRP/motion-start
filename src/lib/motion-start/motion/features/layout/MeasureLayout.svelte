<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
	import type { LayoutGroupContext } from "../../../context/LayoutGroupContext.svelte";
	import type { SwitchLayoutGroupContext } from "../../../context/SwitchLayoutGroupContext";
	import type { VisualElement } from "../../../render/VisualElement.svelte";
	import type { MotionProps } from "../../types";

	interface MeasureContextProps {
		layoutGroup: LayoutGroupContext;
		switchLayoutGroup?: SwitchLayoutGroupContext;
		isPresent: boolean;
		safeToRemove?: VoidFunction | null;
		measurePop?: import("svelte/attachments").Attachment | null;
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
	import { usePresence } from "../../../components/AnimatePresence/use-presence.svelte";
	import { useLayoutGroupContext } from "../../../context/LayoutGroupContext.svelte";
	import { useSwitchLayoutGroupContext } from "../../../context/SwitchLayoutGroupContext";
	import MeasureLayoutWithContext from "./MeasureLayoutWithContext.svelte";
	import { usePresenceContext } from "$lib/motion-start/context/PresenceContext.svelte";
	import { useReorderContext } from "$lib/motion-start/context/ReorderContext";

	interface MeasureLayoutProps extends MotionProps {
		visualElement: VisualElement<unknown>;
	}
	const props: MeasureLayoutProps = $props();

	const [isPresent, safeToRemove] = $derived.by(usePresence());

	const presenceContext = usePresenceContext();
	const reorderContext = useReorderContext();

	const presenceLayoutDependency = $derived(
		presenceContext?.presenceLayoutVersion,
	);
	// measurePop is set by PopChild when mode="popLayout".
	const presenceMeasurePop = $derived(presenceContext?.measurePop);

	const reorderLayoutDependency = $derived(reorderContext?.orderVersion);

	// custom can still serve as a local layout dependency when no explicit
	// layoutDependency or presence-driven version is provided.
	const layoutGroup = $derived(
		useLayoutGroupContext() ?? { forceRender: () => {} },
	);
</script>

<MeasureLayoutWithContext
	{...props}
	layoutDependency={
		props.layoutDependency ??
		props.custom ?? presenceLayoutDependency ?? reorderLayoutDependency}
	measurePop={presenceMeasurePop}
	{layoutGroup}
	switchLayoutGroup={useSwitchLayoutGroupContext() ?? undefined}
	{isPresent}
	{safeToRemove}
/>
