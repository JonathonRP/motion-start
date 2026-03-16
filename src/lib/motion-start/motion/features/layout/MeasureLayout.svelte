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
		snapshotDependency?: number;
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
	import { usePresenceContext } from "../../../context/PresenceContext.svelte";
	import MeasureLayoutWithContext from "./MeasureLayoutWithContext.svelte";

	interface MeasureLayoutProps extends MotionProps {
		visualElement: VisualElement<unknown>;
	}
	const props: MeasureLayoutProps = $props();

	const [isPresent, safeToRemove] = $derived.by(usePresence());

	const presenceContext = usePresenceContext();
	const presenceLayoutDependency = $derived(presenceContext?.layoutDependency);
	const presenceSnapshotDependency = $derived(presenceContext?.snapshotDependency);

	// custom can serve as layoutDependency when no explicit layoutDependency is provided.
	const layoutGroup = $derived(useLayoutGroupContext() ?? { forceRender: () => {} });
</script>

<MeasureLayoutWithContext
	{...props}
	layoutDependency={presenceLayoutDependency ?? props.layoutDependency ?? props.custom}
	snapshotDependency={presenceSnapshotDependency}
	{layoutGroup}
	switchLayoutGroup={useSwitchLayoutGroupContext() ?? undefined}
	{isPresent}
	{safeToRemove}
/>
