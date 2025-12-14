<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" module>
	interface MeasureContextProps {
		layoutGroup: LayoutGroupContext;
		switchLayoutGroup?: SwitchLayoutGroupContext;
		isPresent: boolean;
		safeToRemove?: VoidFunction | null;
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
	import { LayoutGroupContext } from "../../../context/LayoutGroupContext";
	import { SwitchLayoutGroupContext } from "../../../context/SwitchLayoutGroupContext";
	import type { MotionProps } from "../../types";
	import type { VisualElement } from "../../../render/VisualElement.svelte";
	import MeasureLayoutWithContext from "./MeasureLayoutWithContext.svelte";

	interface MeasureLayoutProps extends MotionProps {
		visualElement: VisualElement<unknown>;
	}
	const props: MeasureLayoutProps = $props();

	const [isPresent, safeToRemove] = $derived.by(usePresence());
	const layoutGroup = LayoutGroupContext.getOr({ forceRender: () => {} });
</script>

<MeasureLayoutWithContext
	{...props}
	{layoutGroup}
	switchLayoutGroup={SwitchLayoutGroupContext.getOr({})}
	{isPresent}
	{safeToRemove}
/>
