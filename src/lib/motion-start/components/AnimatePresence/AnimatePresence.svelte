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
	let diffedChildren = $state(new Map<string | number, { key: number }>());
	let exiting = $state(new Set<ComponentKey>());

	let renderedChildren = $state<
		{
			present: boolean;
			data: any;
			key: any;
			onExit: undefined | (() => void);
		}[]
	>([]);

	const updateChildLookup = (
		children: { key: number }[],
		allChild: Map<string | number, { key: number }>,
	) => {
		children.forEach((child) => {
			const key = getChildKey(child);
			allChild.set(key, child);
		});
	};

	$effect(() => {
		// Compute target list
		const targetList = list !== undefined ? list : show ? [{ key: 1 }] : [];

		if (isInitialRender) {
			// On initial render, just show all children
			untrack(() => {
				renderedChildren = targetList.map((v) => ({
					present: true,
					data: v,
					key: v.key,
					onExit: undefined,
				}));
				updateChildLookup(targetList, diffedChildren);
			});
			isInitialRender = false;
		} else {
			// After initial render, handle enter/exit animations
			let newRenderedChildren: typeof renderedChildren = [];

			untrack(() => {
				// IMPORTANT: First preserve existing rendered children in diffedChildren
				// so they can be used for exit animations
				renderedChildren.forEach((c) => {
					if (c.present) {
						diffedChildren.set(getChildKey(c), c.data);
					}
				});
				// Then add any new target children
				updateChildLookup(targetList, diffedChildren);

				// Create list of entering children (present = true)
				newRenderedChildren = [
					...targetList.map((v) => ({
						present: true,
						data: v,
						key: v.key,
						onExit: undefined,
					})),
				];

				// Get keys for diffing
				const targetKeys = targetList.map(getChildKey);
				const presentKeys = untrack(() =>
					renderedChildren.filter((c) => c.present).map(getChildKey),
				);

				// Mark children that are exiting (were present but not in target)
				const numPresent = presentKeys.length;
				for (let i = 0; i < numPresent; i++) {
					const key = presentKeys[i] as string | number;
					if (
						targetKeys.indexOf(key as any) === -1 &&
						!exiting.has(key)
					) {
						exiting.add(key);
					}
				}

				// If mode is wait and we have exiting children, don't render entering ones yet
				if (mode === "wait" && exiting.size) {
					newRenderedChildren.length = 0;
				}

				// Add exiting children to render with exit animations
				exiting.forEach((key) => {
					// If this key has re-entered, skip
					if (targetKeys.indexOf(key) !== -1) {
						exiting.delete(key);
						return;
					}

					const child = diffedChildren.get(key);
					if (!child) {
						return;
					}

					const insertionIndex = presentKeys.indexOf(key);

					const onExit = () => {
						// Guard: If item re-entered (present=true), don't remove it
						const currentChild = renderedChildren.find(
							(c) => getChildKey(c) === key,
						);
						if (currentChild?.present) {
							exiting.delete(key); // Just clean up
							return;
						}
						diffedChildren.delete(key);
						exiting.delete(key);

						// Remove the exiting child from rendered children
						renderedChildren = renderedChildren.filter(
							(c) => getChildKey(c) !== key,
						);

						// If all exiting animations complete, clean up
						if (!exiting.size) {
							forceRender();
							onExitComplete?.();
						}
					};

					newRenderedChildren.splice(insertionIndex, 0, {
						present: false,
						data: child,
						key: getChildKey(child),
						onExit,
					});
				});
			});

			// CRITICAL: Assign OUTSIDE untrack so Svelte sees it as reactive update
			renderedChildren = newRenderedChildren;
		}
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
