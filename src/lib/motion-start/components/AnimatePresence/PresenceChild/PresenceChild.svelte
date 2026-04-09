<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<script module lang="ts">
	function newChildrenMap(): Map<string | number, boolean> {
		return new Map<string | number, boolean>();
	}
</script>

<script lang="ts">
	import { tick } from "svelte";
	import type { Attachment } from "svelte/attachments";
	import {
		type PresenceContext,
		setPresenceContext,
	} from "../../../context/PresenceContext.svelte";
	import PopChild from "../PopChild/PopChild.svelte";
	import type { PresenceChildProps } from "./index.js";

	interface Props extends PresenceChildProps {}

	let {
		isPresent,
		onExitComplete = undefined,
		initial,
		custom = undefined,
		presenceLayoutVersion = 0,
		presenceAffectsLayout,
		mode,
		children: desendants,
	}: Props = $props();

	const presenceChildren = $state(newChildrenMap());
	const id = $props.id();

	// Keep one mutable context object alive so child registration and popLayout
	// measurement survive prop changes without forcing consumers onto a new reference.

	const handleExitComplete = (childId: string | number) => {
		if (!presenceChildren.has(childId)) return;
		presenceChildren.set(childId, true);
		for (const [, isComplete] of presenceChildren) {
			if (!isComplete) return;
		}
		onExitComplete?.();
	};

	const register = (childId: string | number) => {
		presenceChildren.set(childId, false);
		return () => {
			presenceChildren.delete(childId);
		};
	};

	let context = $state<PresenceContext>({
		id,
		register,
		onExitComplete: handleExitComplete,
		measurePop: undefined,
		initial,
		isPresent,
		custom,
		presenceLayoutVersion: 0,
	});

	$effect.pre(() => {
		context.initial = initial;
		context.isPresent = isPresent;
		context.custom = custom;

		if (presenceAffectsLayout && presenceLayoutVersion !== undefined) {
			context.presenceLayoutVersion = presenceLayoutVersion;
		}
	});

	// When this child begins exiting, reset every registered descendant back to
	// incomplete so the parent waits for the new exit cycle to finish.
	$effect(() => {
		if (!isPresent) {
			presenceChildren.forEach((_, key) =>
				presenceChildren.set(key, false),
			);
		}
	});

	// If no descendants registered exit work, we can complete removal on the
	// next tick once the parent has had a chance to mount everything.
	$effect(() => {
		tick().then(() => {
			if (!isPresent && !presenceChildren.size) {
				onExitComplete?.();
			}
		});
	});

	// Provide a stable context object; reactive fields are exposed through getters.
	setPresenceContext(context);

	const component = $derived({ pop: PopChild, props: { isPresent } });
</script>

{#snippet children()}
	{#if mode === "popLayout"}
		<component.pop {...component.props}>
			{@render desendants?.()}
		</component.pop>
	{:else}
		{@render desendants?.()}
	{/if}
{/snippet}

{@render children()}
