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
	let debugIdCounter = 0;

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
		console.log(
			"[AnimatePresence] $effect, targetList:",
			targetList.map((t) => t.key),
			"isInitialRender:",
			isInitialRender,
		);

		if (isInitialRender) {
			// On initial render, just show all children
			untrack(() => {
				renderedChildren = targetList.map(
					(v) =>
						({
							present: true,
							data: v,
							key: v.key,
							onExit: undefined,
							_debugId: ++debugIdCounter,
						}) as any,
				);
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
				// IMPORTANT: Reuse existing rendered child objects where possible
				// to prevent Svelte from recreating components
				console.log(
					"[AnimatePresence] targetList keys:",
					targetList.map(getChildKey),
				);
				console.log(
					"[AnimatePresence] renderedChildren before map:",
					renderedChildren.map((c) => ({
						key: getChildKey(c),
						present: c.present,
						debugId: (c as any)._debugId,
					})),
				);
				newRenderedChildren = targetList.map((v) => {
					const key = getChildKey(v);
					const existing = renderedChildren.find(
						(c) => getChildKey(c) === key && c.present,
					);
					console.log(
						"[AnimatePresence] Looking for key:",
						key,
						"found existing:",
						existing ? (existing as any)._debugId : "none",
					);
					if (existing) {
						// Reuse existing object to maintain component instance
						console.log(
							"[AnimatePresence] Reusing existing child for key:",
							key,
							"debugId:",
							(existing as any)._debugId,
						);
						return existing;
					}
					const newChild = {
						present: true,
						data: v,
						key: v.key,
						onExit: undefined,
						_debugId: ++debugIdCounter,
					} as any;
					console.log(
						"[AnimatePresence] Creating new child for key:",
						key,
						"debugId:",
						newChild._debugId,
					);
					return newChild;
				});

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
						console.log(
							"[AnimatePresence] Marking key as exiting:",
							key,
						);
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
						untrack(() => {
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

							// Remove from rendered children
							const removeIndex = renderedChildren.findIndex(
								(c) => getChildKey(c) === key,
							);
							if (removeIndex >= 0) {
								renderedChildren.splice(removeIndex, 1);
							}

							// If all exiting animations complete
							if (!exiting.size) {
								// Reuse existing objects where possible
								renderedChildren = targetList.map((v) => {
									const key = getChildKey(v);
									const existing = renderedChildren.find(
										(c) =>
											getChildKey(c) === key && c.present,
									);
									return (
										existing ||
										({
											present: true,
											data: v,
											key: v.key,
											onExit: undefined,
											_debugId: ++debugIdCounter,
										} as any)
									);
								});
								forceRender();
								onExitComplete?.();
							}
						});
					};

					// CRITICAL: Find the ORIGINAL child object and MUTATE it
					// This keeps the same object reference so Svelte doesn't recreate the component
					const existingChild = renderedChildren.find(
						(c) => getChildKey(c) === key,
					);
					if (existingChild) {
						// Mutate the existing object - same reference, component stays alive
						existingChild.present = false;
						existingChild.onExit = onExit;
						console.log(
							"[AnimatePresence] Mutating existing child for exit, key:",
							key,
							"debugId:",
							(existingChild as any)._debugId,
						);
						newRenderedChildren.splice(
							insertionIndex,
							0,
							existingChild,
						);
					} else {
						// Fallback: create new object (shouldn't happen normally)
						console.log(
							"[AnimatePresence] Creating new exiting child for key:",
							key,
						);
						newRenderedChildren.splice(insertionIndex, 0, {
							present: false,
							data: child,
							key: getChildKey(child),
							onExit,
							_debugId: ++debugIdCounter,
						} as any);
					}
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

	// DEBUG: Track renderedChildren changes
	$effect(() => {
		console.log(
			"[AnimatePresence] renderedChildren updated:",
			renderedChildren.map((c) => ({
				key: c.key,
				present: c.present,
				id: (c as any)._debugId,
			})),
		);
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
