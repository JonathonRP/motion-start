<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
	interface MeasureContextProps {
		layoutGroup: LayoutGroupContext;
		switchLayoutGroup?: SwitchLayoutGroupContext;
		isPresent: boolean;
		safeToRemove?: VoidFunction | null;
		/** Bumped (via flushSync) before DOM removal to snapshot positions while exiting sibling still in DOM */
		snapshotTrigger?: number;
		/** Bumped on every configAndProps change — used by MeasureLayoutWithContext to re-run on every render */
		_renderCount?: number;
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
	import {
		type LayoutGroupContext,
		useLayoutGroupContext,
	} from "../../../context/LayoutGroupContext.svelte";
	import {
		useSwitchLayoutGroupContext,
		type SwitchLayoutGroupContext,
	} from "../../../context/SwitchLayoutGroupContext";
	import { usePresenceContext } from "../../../context/PresenceContext.svelte";
	import type { MotionProps } from "../../types";
	import type { VisualElement } from "../../../render/VisualElement.svelte";
	import MeasureLayoutWithContext from "./MeasureLayoutWithContext.svelte";

	interface MeasureLayoutProps extends MotionProps {
		visualElement: VisualElement<unknown>;
	}
	const props: MeasureLayoutProps = $props();

	const [isPresent, safeToRemove] = $derived.by(usePresence());

	const presenceContextRef = usePresenceContext();
	const presenceLayoutDependency = $derived(presenceContextRef.current?.layoutDependency);
	const presenceSnapshotTrigger = $derived(presenceContextRef.current?.snapshotTrigger);

	const layoutGroup = $derived(
		useLayoutGroupContext().current ?? {
			forceRender: () => {},
		},
	);
</script>

<MeasureLayoutWithContext
	{...props}
	layoutDependency={presenceLayoutDependency ?? props.layoutDependency}
	snapshotTrigger={presenceSnapshotTrigger}
	{layoutGroup}
	switchLayoutGroup={useSwitchLayoutGroupContext().current}
	{isPresent}
	{safeToRemove}
/>
