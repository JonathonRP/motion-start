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

	export type MeasureProps = MotionProps &
		MeasureContextProps & { visualElement: VisualElement<unknown> };
</script>

<script lang="ts">
	import { usePresence } from "../../../components/AnimatePresence/use-presence.svelte";
	import { useContext } from "../../../context/utils/context";
	import { LayoutGroupContext } from "../../../context/LayoutGroupContext";
	import { SwitchLayoutGroupContext } from "../../../context/SwitchLayoutGroupContext";
	import type { MotionProps } from "../../types";
	import type { VisualElement } from "../../../render/VisualElement.svelte";
	import MeasureLayoutWithContext from "./MeasureLayoutWithContext.svelte";

	const props: MotionProps & { visualElement: VisualElement<unknown> } =
		$props();

	const presence = usePresence();
	const [isPresent, safeToRemove] = $presence;
	const layoutGroup = useContext(LayoutGroupContext);
	const switchLayoutGroup = useContext(SwitchLayoutGroupContext);
</script>

<MeasureLayoutWithContext
	{...props}
	{layoutGroup}
	{switchLayoutGroup}
	{isPresent}
	{safeToRemove}
/>
