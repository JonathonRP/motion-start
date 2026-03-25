<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes={true} />

<script lang="ts" generics="T">
	import { untrack, type Snippet } from "svelte";
	import type { AnimatePresenceProps, ConditionalGeneric } from "./index.js";
	import PresenceChild from "./PresenceChild/PresenceChild.svelte";
	import { useLayoutGroupContext, setLayoutGroupContext } from "../../context/LayoutGroupContext.svelte";
	import { nodeGroup } from "../../projection/node/group";
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

	const parentLayoutContext = useLayoutGroupContext();

	// When presenceAffectsLayout and there's no parent NodeGroup, create an implicit one.
	// This ensures MeasureLayoutWithContext.onDestroy calls group.remove(projection) → dirtyAll()
	// → siblings get willUpdate() BEFORE DOM removal → correct FLIP snapshot timing.
	// Context must be set synchronously; the group is created once and reused so existing
	// node registrations aren't lost if presenceAffectsLayout toggles.
	// presenceAffectsLayout is intentionally read once — changing it after mount isn't supported.
	const implicitGroup = presenceAffectsLayout && !parentLayoutContext?.group ? nodeGroup() : undefined;
	if (implicitGroup) {
		setLayoutGroupContext({
			...parentLayoutContext,
			group: implicitGroup,
		});
	}

	const layoutContext = $derived(useLayoutGroupContext());
	const forceRender = () => {
		layoutContext?.forceRender?.();
		renderedChildren = [...renderedChildren];
	};

	let isInitialRender = $state(true);
	// Bumped after DOM removal so MeasureLayoutWithContext's watch (EFFECT) calls
	// didUpdate() once the new DOM layout is committed.
	let sharedLayoutDependency = $state(0);

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

	// exitGeneration guards against stale onExit callbacks firing after a key
	// has re-entered and exited again. Each new onExit closure for a key captures
	// the current generation; if it no longer matches when the promise resolves,
	// the callback is discarded.
	const exitGeneration = new Map<ComponentKey, number>();

	// pendingPresentChildren holds the latest target list so onExit closures
	// always restore to the most recent snapshot, not a stale closure value.
	let pendingPresentChildren: typeof renderedChildren = [];

	$effect.pre(() => {
		// Compute target list from reactive props
		const presentChildren: typeof renderedChildren =
			list !== undefined
				? list.map((v) => ({
						present: true,
						data: v,
						key: v.key,
						onExit: undefined,
					}))
				: show
					? [
							{
								present: true,
								data: { key: 1 },
								key: 1,
								onExit: undefined,
							},
						]
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
					// Invalidate any in-flight onExit for this key by bumping the generation.
					// Do NOT delete — we keep the counter so the next exit gets gen+1,
					// ensuring stale callbacks from before re-entry can never match.
					exitGeneration.set(key, (exitGeneration.get(key) ?? 0) + 1);
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

				const gen = (exitGeneration.get(key) ?? 0) + 1;
				exitGeneration.set(key, gen);

				const onExit = () => {
					if (!exitComplete.has(key)) return;
					// Guard against stale callbacks: if a key re-entered and exited again
					// before this promise resolved, our generation will be outdated.
					if (exitGeneration.get(key) !== gen) return;
					exitComplete.set(key, true);

					let allComplete = true;
					exitComplete.forEach((done) => {
						if (!done) allComplete = false;
					});

					if (presenceAffectsLayout) {
						// Snapshot sibling positions NOW, while the exiting element is still
						// in the DOM. didUpdate() fires after DOM removal via sharedLayoutDependency.
						implicitGroup?.dirty();
					}

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

					if (presenceAffectsLayout) {
						// Signal didUpdate after DOM removal is committed.
						// MeasureLayoutWithContext's watch (EFFECT) fires didUpdate() when this changes,
						// after Svelte has committed the DOM removal in the same batch.
						sharedLayoutDependency++;
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

			// In popLayout mode, bump sharedLayoutDependency so siblings FLIP immediately
			// when the exiting element is removed from flow by measurePop.
			// In sync mode siblings don't move until onExit fires (after exit animation),
			// so we skip here — onExit handles snapshot+didUpdate instead.
			if (presenceAffectsLayout && mode === "popLayout") {
				sharedLayoutDependency++;
			}
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
		initial={!isInitialRender || initial ? undefined : false}
		custom={child.onExit ? custom : undefined}
		{presenceAffectsLayout}
		{sharedLayoutDependency}
		onExitComplete={child.onExit}
	>
		{@render children?.({ item: child.data })}
	</PresenceChild>
{/each}
