<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts" generics="T extends {key:any}">
    import type { ConditionalGeneric, AnimatePresenceProps } from "./index.js";
    import { useContext } from "../../context/utils/context.svelte.js";
    import { LayoutGroupContext } from "../../context/LayoutGroupContext";
    import PresenceChild from "./PresenceChild/PresenceChild.svelte";
    import { fromStore } from "svelte/store";
    import { SvelteMap, SvelteSet } from "svelte/reactivity";
    import { onDestroy, untrack, type Snippet } from "svelte";
    import { type ComponentKey, getChildKey } from "./utils.js";
    import { invariant } from "../../utils/errors.js";

    type Props = AnimatePresenceProps<ConditionalGeneric<T>> & {
        isCustom?: boolean;
        children?: Snippet<[typeof list | { key: number }]>;
    };

    let {
        exitBeforeEnter,
        custom,
        initial,
        onExitComplete,
        presenceAffectsLayout = true,
        mode = "sync",
        list,
        show,
        isCustom = false,
        children,
    }: Props = $props();

    invariant(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");

    let _list = $state(list !== undefined ? list : show ? [{ key: 1 }] : []);

    let presentChildren = $state(_list);
    const presentKeys = $derived(presentChildren.map(getChildKey));

    let isInitialRender = $state(true);

    let renderedChildren = $state(
        presentChildren.map((v) => ({
            present: true,
            item: v,
            key: v.key,
            onExit: undefined,
        })),
    );

    let exitComplete = new SvelteMap<ComponentKey, boolean>(
        _list.map(getChildKey).map((key) => {
            return [key, !!key];
        }),
    );
    const exitingChildren = new SvelteSet<number>();

    const layoutContext = fromStore(
        useContext(LayoutGroupContext, isCustom),
    ).current;
    const forceRender = $derived(() => {
        layoutContext.forceRender?.();
        _list = [..._list];
    });

    $effect.pre(() => {
        if (!isInitialRender) {
            /**
             * Update complete status of exiting children.
             */
            for (let i = 0; i < presentKeys.length; i++) {
                const key = presentKeys[i];

                if (!presentKeys.includes(key)) {
                    if (exitComplete.has(key)) {
                        exitingChildren.add(key!);
                    }
                } else {
                    exitingChildren.delete(key!);
                }
            }

            let nextChildren = [...presentChildren];

            /**
             * Loop through all the currently rendered components and decide which
             * are exiting.
             */
            for (let i = 0; i < renderedChildren.length; i++) {
                const child = renderedChildren[i];
                const key = getChildKey(child);

                if (!presentKeys.includes(key)) {
                    nextChildren.splice(i, 0, child);
                    exitingChildren.add(key!);
                }
            }

            /**
             * If we're in "wait" mode, and we have exiting children, we want to
             * only render these until they've all exited.
             */
            if (mode === "wait" && exitingChildren.size) {
                nextChildren = [...exitingChildren].map((key) => ({ key }));
            }

            exitingChildren.forEach((key) => {
                const child = presentChildren.find((e) => e.key === key);
                renderedChildren.splice(presentKeys.indexOf(key), 0, {
                    present: false,
                    item: child,
                    key: getChildKey(child),
                    onExit:
                        !isInitialRender &&
                        exitComplete.has(key) &&
                        !_list.includes(child)
                            ? () => {
                                  exitingChildren.delete(key!);

                                  // Remove this child from the present children
                                  const removeIndex = presentChildren.findIndex(
                                      (presentChild) =>
                                          presentChild.key === key,
                                  );

                                  if (removeIndex < 0) {
                                      return;
                                  }
                                  presentChildren.splice(removeIndex, 1);

                                  // Defer re-rendering until all exiting children have indeed left
                                  if (!exitingChildren.size) {
                                      renderedChildren = [..._list];
                                      forceRender?.();
                                      onExitComplete && onExitComplete();
                                  }
                              }
                            : undefined,
                });
            });

            /**
             * Early return to ensure once we've set state with the latest diffed
             * children, we can immediately re-render.
             */
            presentChildren = renderedChildren;
            return;
        } else {
            isInitialRender = false;
        }

        if (
            process.env.NODE_ENV !== "production" &&
            mode === "wait" &&
            renderedChildren.length > 1
        ) {
            console.warn(
                `You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`,
            );
        }
    });
</script>

{#each renderedChildren as child (child.key)}
    <PresenceChild
        {mode}
        isPresent={child.present}
        initial={!isInitialRender || initial ? undefined : false}
        custom={child.onExit ? custom : undefined}
        {presenceAffectsLayout}
        onExitComplete={child.onExit}
        {isCustom}
    >
        {@render children?.(child.item)}
    </PresenceChild>
{/each}
