<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="T extends {key:any}">
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import PopChild from "./PopChild.svelte";

    type $$Props = AnimatePresenceProps<ConditionalGeneric<T>>;

    let {
        list = undefined,
        custom = undefined,
        initial = true,
        onExitComplete = undefined,
        exitBeforeEnter = undefined,
        mode = undefined,
        presenceAffectsLayout = true,
        show = undefined,
        isCustom = false
    }: $$Props = $props();

    // Convert exitBeforeEnter to mode for backward compatibility
    const actualMode = $derived(mode || (exitBeforeEnter ? "wait" : "sync"));

    let _list = $derived(list !== undefined ? list : show ? [{ key: 1 }] : []);

    function getChildKey(child: { key: number }) {
        return child.key || "";
    }

    let isInitialRender = $state(true);
    let filteredChildren = $derived(_list);

    // State matching v11.11.11 patterns
    let renderedChildren = $state(filteredChildren);
    let allChildren = $state(new Map<string | number, { key: number }>());
    let exitComplete = $state(new Set<"" | number>());

    $effect(() => {
        const children = filteredChildren;
        const allChild = allChildren;
        children.forEach((child) => {
            const key = getChildKey(child);
            allChild.set(key, child);
        });
    });

    let childrenToRender = $state<{
        present: boolean;
        item: any;
        key: any;
        onExit: undefined | (() => void);
    }[]>([
        ...filteredChildren.map((v) => ({
            present: true,
            item: v,
            key: v.key,
            onExit: undefined,
        })),
    ]);

    $effect(() => {
        if (!isInitialRender) {
            // If this is a subsequent render, deal with entering and exiting children
            childrenToRender = [
                ...filteredChildren.map((v) => ({
                    present: true,
                    item: v,
                    key: v.key,
                    onExit: undefined,
                })),
            ];

            // Diff the keys of the currently-present and target children to update our
            // exit tracking (v11.11.11 uses exitComplete Set)
            const presentKeys = renderedChildren.map(getChildKey);
            const targetKeys = filteredChildren.map(getChildKey);
            // Diff the rendered children with our target children and mark those that are exiting
            const numPresent = presentKeys.length;
            for (let i = 0; i < numPresent; i++) {
                const key = presentKeys[i];
                if (targetKeys.indexOf(key) === -1) {
                    exitComplete.add(key);
                } else {
                    // In case this key has re-entered, remove from the exit tracking
                    exitComplete.delete(key);
                }
            }

            // If we currently have exiting children, and we're in "wait" mode,
            // defer rendering incoming children until after all current children have exited
            if (actualMode === "wait" && exitComplete.size) {
                childrenToRender = [];
            }
            // Loop through all currently exiting components and clone them to overwrite `animate`
            // with any `exit` prop they might have defined.
            exitComplete.forEach((key) => {
                // If this component is actually entering again, early return
                if (targetKeys.indexOf(key) !== -1) return;

                const child = allChildren.get(key);
                if (!child) return;

                const insertionIndex = presentKeys.indexOf(key);

                const onExit = () => {
                    allChildren.delete(key);
                    exitComplete.delete(key);

                    // Remove this child from the present children
                    const removeIndex = renderedChildren.findIndex(
                        (presentChild) => presentChild.key === key,
                    );

                    if (removeIndex < 0) {
                        return;
                    }
                    renderedChildren.splice(removeIndex, 1);

                    // Defer re-rendering until all exiting children have indeed left
                    if (!exitComplete.size) {
                        renderedChildren = [...filteredChildren];
                        onExitComplete && onExitComplete();
                    }
                };

                childrenToRender.splice(insertionIndex, 0, {
                    present: false,
                    item: child,
                    key: getChildKey(child),
                    onExit,
                });
            });
            // Add `MotionContext` even to children that don't need it to ensure we're rendering
            // the same tree between renders

            /*
            childrenToRender = childrenToRender.map((child) => {
                const key = child.key as string | number;
                return exitComplete.has(key) ? (
                    child
                ) : (
                    <PresenceChild
                        key={getChildKey(child)}
                        isPresent
                        presenceAffectsLayout={presenceAffectsLayout}
                    >
                        {child}
                    </PresenceChild>
                );
            });
            */
            renderedChildren = childrenToRender;
        } else {
            isInitialRender = false;
        }
    });
</script>

{#each childrenToRender as child (getChildKey(child))}
    {#if actualMode === "popLayout" && !child.present}
        <PopChild isPresent={child.present}>
            {#snippet children()}
                <PresenceChild
                    isPresent={child.present}
                    initial={initial ? undefined : false}
                    custom={child.onExit ? custom : undefined}
                    {presenceAffectsLayout}
                    onExitComplete={child.onExit}
                    {isCustom}
                >
                    <slot item={child.item} />
                </PresenceChild>
            {/snippet}
        </PopChild>
    {:else}
        <PresenceChild
            isPresent={child.present}
            initial={initial ? undefined : false}
            custom={child.onExit ? custom : undefined}
            {presenceAffectsLayout}
            onExitComplete={child.onExit}
            {isCustom}
        >
            <slot item={child.item} />
        </PresenceChild>
    {/if}
{/each}
