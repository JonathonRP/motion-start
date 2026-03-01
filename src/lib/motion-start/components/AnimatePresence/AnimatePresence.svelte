<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes={true} />

<script lang="ts" generics="T">
	import { untrack, type Snippet } from "svelte";
	import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
	import PresenceChild from "./PresenceChild/PresenceChild.svelte";
	import { useLayoutGroupContext } from "../../context/LayoutGroupContext.svelte";
	import { warning } from "../../utils/errors.js";
	import { getChildKey, type ComponentKey } from "./utils.js";

	type Props = AnimatePresenceProps<ConditionalGeneric<T>>;

	let {
		values: list,
		custom,
		initial = true,
		onExitComplete,
		exitBeforeEnter = undefined,
		mode = exitBeforeEnter ? "wait" : "sync",
		presenceAffectsLayout = true,
		show,
		children,
	}: Props & {
		children?: Snippet<[{ item: ConditionalGeneric<T> }]>;
	} = $props();

	$effect(() => {
		warning(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");
	});

	const layoutContext = $derived(useLayoutGroupContext().current);
	const forceRender = () => {
		layoutContext.forceRender?.();
		renderedChildren = [...renderedChildren];
	};

	let isInitialRender = $state(true);

	// renderedChildren is the authoritative render list (present + exiting).
	let renderedChildren = $state<
		{
			present: boolean;
			data: any;
			key: any;
			onExit: undefined | (() => void);
		}[]
	>([]);

	// exitComplete tracks which exiting keys have finished their animation.
	// Plain Map (not $state) — mutated imperatively, read inside onExit closures.
	const exitComplete = new Map<ComponentKey, boolean>();

	// pendingPresentChildren holds the latest target list so onExit closures
	// always restore to the most recent snapshot, not a stale closure value.
	let pendingPresentChildren: typeof renderedChildren = [];

	$effect(() => {
		// Compute target list from reactive props
		const presentChildren: typeof renderedChildren =
			list !== undefined
				? list.map((v) => ({ present: true, data: v, key: v.key, onExit: undefined }))
				: show
					? [{ present: true, data: { key: 1 }, key: 1, onExit: undefined }]
					: [];

		const presentKeys = presentChildren.map((c) => getChildKey(c));

		if (isInitialRender) {
			untrack(() => {
				renderedChildren = presentChildren;
				pendingPresentChildren = presentChildren;
			});
			isInitialRender = false;
			return;
		}

		// Always update the pending snapshot to the latest present children.
		// onExit closures read this so they use the current target, not a stale one.
		pendingPresentChildren = presentChildren;

		untrack(() => {
			// Update exitComplete: initialise newly exiting keys to false,
			// delete keys that have re-entered.
			for (let i = 0; i < renderedChildren.length; i++) {
				const key = getChildKey(renderedChildren[i]);
				if (!presentKeys.includes(key)) {
					if (exitComplete.get(key) !== true) {
						exitComplete.set(key, false);
					}
				} else {
					exitComplete.delete(key);
				}
			}

			// Build next render list starting from presentChildren.
			let nextChildren = [...presentChildren];

			// Re-insert exiting children at their original positions.
			const exitingChildren: typeof renderedChildren = [];
			for (let i = 0; i < renderedChildren.length; i++) {
				const child = renderedChildren[i];
				const key = getChildKey(child);
				if (presentKeys.includes(key)) continue;

				// Already has an onExit callback — preserve it to avoid creating
				// duplicate callbacks for the same key when the effect re-runs.
				const existingExiting = renderedChildren.find(
					(c) => getChildKey(c) === key && !c.present,
				);
				if (existingExiting) {
					nextChildren.splice(i, 0, existingExiting);
					exitingChildren.push(existingExiting);
					continue;
				}

				const onExit = () => {
					if (!exitComplete.has(key)) return;
					exitComplete.set(key, true);

					let allComplete = true;
					exitComplete.forEach((done) => {
						if (!done) allComplete = false;
					});

					if (allComplete) {
						exitComplete.clear();
						// Use pendingPresentChildren — always the latest target list.
						renderedChildren = pendingPresentChildren;
						forceRender();
						onExitComplete?.();
					} else {
						// Remove just this child from the rendered list.
						renderedChildren = renderedChildren.filter(
							(c) => getChildKey(c) !== key,
						);
					}
				};

				const exitChild = { ...child, present: false, onExit };
				nextChildren.splice(i, 0, exitChild);
				exitingChildren.push(exitChild);
			}

			// In "wait" mode, only render exiting children until they're done.
			if (mode === "wait" && exitingChildren.length) {
				nextChildren = exitingChildren;
			}

			renderedChildren = nextChildren;
		});
	});

	$effect(() => {
		if (
			process.env.NODE_ENV !== "production" &&
			mode === "wait" &&
			untrack(() => renderedChildren.filter((c) => c.present).length > 1)
		) {
			console.warn(
				`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`,
			);
		}
	});
</script>

{#each renderedChildren as child (getChildKey(child))}
	<PresenceChild
		{mode}
		isPresent={child.present}
		initial={!isInitialRender && initial ? undefined : false}
		custom={child.onExit ? custom : undefined}
		{presenceAffectsLayout}
		onExitComplete={child.onExit}
	>
		{@render children?.({ item: child.data })}
	</PresenceChild>
{/each}
