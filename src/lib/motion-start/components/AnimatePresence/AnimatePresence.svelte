<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes={true} />

<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import { LayoutGroupContext } from "../../context/LayoutGroupContext.svelte";
    import { invariant } from "../../utils/errors.js";
    import { getChildKey, type ComponentKey } from "./utils.js";

    type Props = AnimatePresenceProps<ConditionalGeneric<T>>;

    const props = $props();

    // Track these reactively so $effect dependencies work
    let list = $derived(props.values ?? undefined);
    let mode = $derived(props.mode ?? ("sync" as const));
    let custom = $derived(props.custom ?? undefined);
    let initial = $derived(props.initial ?? true);
    let onExitComplete = $derived(props.onExitComplete ?? undefined);
    let exitBeforeEnter = $derived(props.exitBeforeEnter ?? undefined);
    let presenceAffectsLayout = $derived(props.presenceAffectsLayout ?? true);
    let show = $derived(props.show ?? undefined);

    invariant(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");

    const layoutContext = $derived(LayoutGroupContext.getOr({} as any));
    const forceRender = () => {
        untrack(() => {
            layoutContext?.forceRender?.();
            renderedChildren = [...renderedChildren];
        });
    };

    let isInitialRender = $state(true);
    let diffedChildren = $state(new Map<string | number, { key: number }>());
    let exiting = $state(new Set<ComponentKey>());

    let renderedChildren = $state<
        {
            present: boolean;
            item: any;
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
        // Access props directly to ensure reactivity
        const currentShow = props.show;
        const currentList = props.values;
        const currentMode = props.mode;

        // Compute target list
        const targetList =
            currentList !== undefined
                ? currentList
                : currentShow
                  ? [{ key: 1 }]
                  : [];

        if (isInitialRender) {
            // On initial render, just show all children
            untrack(() => {
                renderedChildren = targetList.map((v) => ({
                    present: true,
                    item: v,
                    key: v.key,
                    onExit: undefined,
                }));
                updateChildLookup(targetList, diffedChildren);
            });
            isInitialRender = false;
        } else {
            // After initial render, handle enter/exit animations
            let newRenderedChildren: typeof renderedChildren;

            untrack(() => {
                // Update child lookup with new list
                updateChildLookup(targetList, diffedChildren);

                // Create list of entering children (present = true)
                newRenderedChildren = [
                    ...targetList.map((v) => ({
                        present: true,
                        item: v,
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

                // Handle exiting children
                if (exiting.size) {
                    // If mode is wait and we have exiting children, don't render entering ones yet
                    if (mode === "wait") {
                        newRenderedChildren.length = 0;
                    }

                    // Add exiting children to render with exit animations
                    exiting.forEach((key) => {
                        // If this key has re-entered, skip
                        if (targetKeys.indexOf(key) !== -1) return;

                        const child = diffedChildren.get(key);
                        if (!child) return;

                        const insertionIndex = presentKeys.indexOf(key);

                        const onExit = () => {
                            untrack(() => {
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
                                    renderedChildren = targetList.map((v) => ({
                                        present: true,
                                        item: v,
                                        key: v.key,
                                        onExit: undefined,
                                    }));
                                    forceRender();
                                    onExitComplete?.();
                                }
                            });
                        };

                        newRenderedChildren.splice(insertionIndex, 0, {
                            present: false,
                            item: child,
                            key: getChildKey(child),
                            onExit,
                        });
                    });
                }
            });

            // CRITICAL: Only update if children actually changed to prevent infinite loops
            if (JSON.stringify(renderedChildren.map(c => ({present: c.present, key: c.key}))) !== 
                JSON.stringify(newRenderedChildren.map(c => ({present: c.present, key: c.key})))) {
                renderedChildren = newRenderedChildren;
            }
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
        mode={mode ?? "sync"}
        isPresent={child.present}
        initial={!isInitialRender && initial ? undefined : false}
        custom={child.onExit ? custom : undefined}
        {presenceAffectsLayout}
        onExitComplete={child.onExit}
    >
        {#snippet children({ measure })}
            <slot item={child.item} {measure} />
        {/snippet}
    </PresenceChild>
{/each}
